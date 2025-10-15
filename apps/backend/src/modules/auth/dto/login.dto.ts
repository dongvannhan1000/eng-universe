import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username (email)',
    example: 'user@example.com',
  })
  @IsEmail()
  username!: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecurePass123!',
  })
  @IsString()
  password!: string;
}
