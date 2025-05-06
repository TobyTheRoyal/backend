import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const { username, email, password } = registerDto;
    try {
      console.log('Registering user:', { username, email });
      const existingUserByEmail = await this.usersService.findByEmail(email);
      if (existingUserByEmail) throw new ConflictException('Email already exists');
      const existingUserByUsername = await this.usersService.findByUsername(username);
      if (existingUserByUsername) throw new ConflictException('Username already exists');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({ username, email, password: hashedPassword });
      if (!user || !user.id) throw new Error('Failed to create user');
      console.log('User created:', { id: user.id, email: user.email });
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      console.log('Generated token:', access_token);
      return { access_token };
    } catch (error) {
      console.error('Registration error:', error.message, error.stack);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    try {
      console.log('Login attempt:', { email });
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        console.log('User not found:', email);
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Password invalid for:', email);
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      console.log('Login successful, token:', access_token);
      return { access_token };
    } catch (error) {
      console.error('Login error:', error.message, error.stack);
      throw error;
    }
  }
}