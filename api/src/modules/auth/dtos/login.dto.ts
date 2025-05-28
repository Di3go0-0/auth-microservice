import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    type: String,
    example: 'pepito@correo.com',
    required: true,
    description: 'User email address',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Password123!',
    required: true,
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
