import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from '../constants/jwt.constants';
import { JwtInfrastructureConfig } from '../types/jwt-config.type';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  const jwtConfig: JwtInfrastructureConfig = {
    accessSecret: 'test-access-secret',
    refreshSecret: 'test-refresh-secret',
    accessTtl: '15m',
    refreshTtl: '7d',
    issuer: 'noviq-api',
    audience: 'noviq-client',
  };

  beforeEach(() => {
    service = new TokenService(new JwtService(), jwtConfig);
  });

  it('issues access and refresh tokens with expiration metadata', async () => {
    const pair = await service.issueTokenPair({
      sub: 'user-1',
      roles: ['student'],
    });

    expect(pair.accessToken).toEqual(expect.any(String));
    expect(pair.refreshToken).toEqual(expect.any(String));
    expect(pair.expiresIn).toBe(900);
  });

  it('verifies access and refresh tokens with token type protection', async () => {
    const pair = await service.issueTokenPair({ sub: 'user-1' });
    const wrongTypeAccessSecretToken = await new JwtService().signAsync(
      {
        sub: 'user-1',
        type: 'refresh',
      },
      {
        audience: jwtConfig.audience,
        expiresIn: jwtConfig.accessTtl,
        issuer: jwtConfig.issuer,
        secret: jwtConfig.accessSecret,
      },
    );

    await expect(
      service.verifyAccessToken(pair.accessToken),
    ).resolves.toMatchObject({
      sub: 'user-1',
      type: 'access',
    });
    await expect(
      service.verifyRefreshToken(pair.refreshToken),
    ).resolves.toMatchObject({
      sub: 'user-1',
      type: 'refresh',
    });
    await expect(
      service.verifyAccessToken(wrongTypeAccessSecretToken),
    ).rejects.toThrow('Invalid access token type');
  });

  it('adds a jti to refresh tokens', async () => {
    const refreshToken = await service.issueRefreshToken({ sub: 'user-1' });
    const payload = await service.verifyRefreshToken(refreshToken);

    expect(payload.jti).toEqual(expect.any(String));
  });
});

describe('TokenService provider contract', () => {
  it('uses JWT_CONFIG as the configuration injection token', () => {
    expect(JWT_CONFIG).toBe(Symbol.for('JWT_CONFIG'));
  });
});
