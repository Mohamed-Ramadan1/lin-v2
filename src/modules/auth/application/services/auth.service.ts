import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersRepository, USERS_REPOSITORY } from '@modules/users/domain/index';
import { LoginDto, RegisterDto } from '../../presentation/dto/index';
import { PasswordService } from '../../../../infrastructure/security/password/password.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

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
      console.log('User created:', createdUser);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      }
      throw err;
    }

    // TODO: issue JWT tokens
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

    // TODO: issue JWT tokens
    return { userId: user.id };
  }
}
