import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';

import { UserActiveInterface } from '../../common/interfaces/user-active.interface';
import { ActiveUser } from '../../common/decorators/active-user.decorator';
import { ProfileEditDto } from './dto/profile-edit.dto';
import { Auth } from './decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
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
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
  })
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user);
  }

  @Patch('profile/edit/:id')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
  })
  @Auth(Role.USER)
  editProfile(@Param('id') id: number, @Body() profileEditDto: ProfileEditDto) {
    return this.authService.editProfile(id, profileEditDto);
  }
}
