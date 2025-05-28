import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { Match } from "src/shared/decorators";

export class RegisterDto {
  @ApiProperty({
    type: String,
    example: 'pepito@pepito.com',
    required: true,
    description: 'User email address',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must enter a valid email' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Password123!',
    required: true,
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least one uppercase, lowercase and a number or special character',
  })
  password: string;

  @ApiProperty({
    type: String,
    example: 'Password123!',
    required: true,
    description: 'Password confirmation',
  })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
