import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { Category } from '../categories/entities/category.entity';
import { JWT_CONSTANTS } from '../../constants/jwt.constants';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
