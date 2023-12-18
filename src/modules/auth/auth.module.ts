import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { Category } from '../categories/entities/category.entity';
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
