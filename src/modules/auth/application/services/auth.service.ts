import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersRepository, USERS_REPOSITORY } from '@modules/users/domain/index';
import { LoginDto, RegisterDto } from '../../presentation/dto/index';
import {
  PasswordService,
  TokenService,
  CacheService,
  EmailName,
} from '@infrastructure/index';
import { randomUUID, createHash } from 'crypto';
import { QueueService, EMAIL_QUEUE_NAME } from '@infrastructure/index';
import ms from 'ms';

@Injectable()
export class AuthService {
  private readonly refreshTokenTtlMs: number;
  private readonly emailQueueName = EMAIL_QUEUE_NAME;
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,

    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,

    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
    @Inject('REFRESH_TOKEN_KEY_PREFIX')
    private readonly refreshTokenKey: string = 'refresh_token',
  ) {
    const rawTtl = this.configService.get<string>('JWT_REFRESH_TTL', '7d');
    const parsedTtl = ms(rawTtl as ms.StringValue);

    if (typeof parsedTtl !== 'number') {
      throw new Error(`Invalid JWT_REFRESH_TTL value: "${rawTtl}"`);
    }
    this.refreshTokenTtlMs = parsedTtl;
  }

  async register(registerDto: RegisterDto) {
    if (await this.usersRepository.userExists(registerDto.email)) {
      throw new ConflictException('User with this email already exists.');
    }

    const passwordHash = await this.passwordService.hash(registerDto.password);
    try {
      const createdUser = await this.usersRepository.create({
        name: registerDto.name,
        email: registerDto.email,
        passwordHash,
      });

      await this.queueService.add(this.emailQueueName, 'send-email', {
        to: createdUser.email,
        subject:
          'Welcome to Noviq platform place you can organize your life inside. ',
        emailName: EmailName.WELCOME,
        templateData: {
          userName: createdUser.name,
        },
      });

      return await this.issueTokens(createdUser.id, createdUser.roles);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      }
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmailWithPassword(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await this.passwordService.verify(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return await this.issueTokens(user.id, user.roles);
  }

  // Helper reusable methods.

  private async issueTokens(userId: string, roles: string[]) {
    const accessToken = await this.tokenService.issueAccessToken({
      sub: userId,
      roles: roles,
      jti: randomUUID(),
    });

    const { refreshToken, refreshTokenHash } = this.createRefreshTokenPair();

    await this.saveRefreshToken(userId, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(
    userId: string,
    refreshTokenHash: string,
  ): Promise<void> {
    const key = this.buildRefreshTokenKey(refreshTokenHash);
    const payload = JSON.stringify({
      userId,
      revoked: false,
      createdAt: Date.now(),
    });
    const saved = await this.cacheService.set(
      key,
      payload,
      this.refreshTokenTtlMs,
    );
    if (!saved) {
      throw new InternalServerErrorException(
        'Failed to persist refresh token.',
      );
    }
  }

  private buildRefreshTokenKey(hash: string): string {
    return `${this.refreshTokenKey}:${hash}`;
  }

  private createRefreshTokenPair() {
    const refreshToken = randomUUID();
    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    return { refreshToken, refreshTokenHash };
  }
}
