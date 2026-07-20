import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository, USERS_REPOSITORY } from '@modules/users/domain/index';
import { LoginDto, RegisterDto } from '../../presentation/dto/index';
import { hashSync } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if there duplication user by email preventer
    if (await this.usersRepository.userExists(registerDto.email)) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = hashSync(registerDto.password, 10);

    await this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash: hashedPassword,
    });
  }

  login(loginDto: LoginDto) {
    // await this.usersRepository.findByEmail(loginDto.email);
    console.log(loginDto);
  }
}
