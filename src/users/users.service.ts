import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(userData: { username: string; email: string; password: string }): Promise<User> {
    const user = this.userRepository.create(userData);
    try {
      const savedUser = await this.userRepository.save(user);
      console.log('User saved:', { id: savedUser.id, email: savedUser.email });
      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error.message, error.stack);
      throw new ConflictException('Could not create user: ' + error.message);
    }
  }
}