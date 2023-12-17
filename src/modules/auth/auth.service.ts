import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserActiveInterface } from '../../common/interfaces/user-active.interface';
import { Category } from '../categories/entities/category.entity';
import { ProfileEditDto } from './dto/profile-edit.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async register({ name, email, password, categoriesIds }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    // para capturar las categorias que desee un usuario;
    newUser.password = await bcrypt.hash(password, 10);
    const categoriesList = await this.categoryRepository.findByIds(
      categoriesIds,
    );
    newUser.categories = categoriesList;
    await this.userRepository.save(newUser);

    return newUser;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      name: user.name,
      email: user.email,
      access_token: token,
    };
  }

  async profile(user: UserActiveInterface) {
    return await this.usersService.findOneByEmail(user.email);
  }

  async editProfile(id: number, profileEditDto: ProfileEditDto) {
    if (
      !profileEditDto.name &&
      !profileEditDto.email &&
      !profileEditDto.password
    ) {
      throw new BadRequestException('No data to update');
    }
    if (profileEditDto.email) {
      const user = await this.usersService.findOneByEmail(profileEditDto.email);
      if (user && user.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }
    if (profileEditDto.password) {
      profileEditDto.password = await bcrypt.hash(profileEditDto.password, 10);
    }
    return await this.userRepository.update(id, profileEditDto);
  }
}
