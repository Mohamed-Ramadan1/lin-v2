import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto } from '../dto/index';
import { AuthGuard, Public, TransformResponseInterceptor } from '@common/index';
import { Response } from 'express';
import ms from 'ms';

@Controller('')
@Public()
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  private readonly accessTokenTtl: number;
  private readonly nodeEnv: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const accessTtl = this.configService.get<string>('JWT_ACCESS_TTL');
    this.nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    this.accessTokenTtl = ms(accessTtl as ms.StringValue);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body()
    registerDto: RegisterDto,
  ) {
    const { accessToken } = await this.authService.register(registerDto);
    this.setRequestCookies(res, accessToken);
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

  private setRequestCookies(res: Response, accessToken: string): void {
    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: this.accessTokenTtl,
    });
  }
}
