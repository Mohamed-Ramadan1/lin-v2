import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository, USERS_REPOSITORY } from '@modules/users/domain/index';
import { LoginDto, RegisterDto } from '../../presentation/dto/index';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}
  login(loginDto: LoginDto) {
    // await this.usersRepository.findByEmail(loginDto.email);
    console.log(loginDto);
  }
  async register(registerDto: RegisterDto) {
    await this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash: registerDto.password,
    });
  }
}
