import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '@common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Email address used for login',
    example: 'john@example.com',
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Str0ng!Pass',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({
    description: 'Must match the password field',
    example: 'Str0ng!Pass',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmedPassword!: string;
}
