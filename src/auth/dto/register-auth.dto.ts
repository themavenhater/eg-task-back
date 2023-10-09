import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterAuthDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  fullName: string;
}
