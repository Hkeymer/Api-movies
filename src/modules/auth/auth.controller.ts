import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';

import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ProfileEditDto } from './dto/profile-edit.dto';
import { Auth } from './decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user);
  }

  @Patch('profile/edit/:id')
  @Auth(Role.USER)
  editProfile(@Param('id') id: number, @Body() profileEditDto: ProfileEditDto) {
    return this.authService.editProfile(id, profileEditDto);
  }
}
