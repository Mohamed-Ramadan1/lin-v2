import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UsersRepository } from '../../domain/repository/users.repository';

@Injectable()
export class UsersRepositoryService implements UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .getOne();
  }

  async create(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repo.update(id, user);
    return this.repo.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async userExists(email: string): Promise<boolean> {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }
}
