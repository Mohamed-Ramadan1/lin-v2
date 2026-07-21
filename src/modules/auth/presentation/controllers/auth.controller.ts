import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto } from '../dto/index';
import { AuthGuard, Public, TransformResponseInterceptor } from '@common/index';

@Controller('')
@Public()
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    registerDto: RegisterDto,
  ) {
    await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    // await this.authService.login(loginDto);
    console.log(loginDto);
  }
}
