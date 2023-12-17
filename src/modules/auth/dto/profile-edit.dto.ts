import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { RegisterDto } from './register.dto';
export class ProfileEditDto extends PartialType(RegisterDto) {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
