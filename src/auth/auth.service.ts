import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SALT_ROUNDS } from 'src/util/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginAuthDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new ConflictException('invalid credentials');
    }
    const { hashedPass, ...userInfo } = user;
    return {
      access_token: this.jwtService.sign({ userId: user._id }),
      userInfo,
    };
  }

  async register(regDto: RegisterAuthDto) {
    const user = await this.userService.findByEmail(regDto.email);
    if (user) {
      throw new ConflictException('user already exists with this email');
    }
    const hashedPass = await bcrypt.hash(regDto.password, SALT_ROUNDS);
    const newUser = await this.userService.create({
      ...regDto,
      hashedPass,
    });
    const { hashedPass: hs, ...userInfo } = newUser;
    return {
      access_token: await this.jwtService.signAsync({ userId: newUser._id }),
      userInfo,
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.hashedPass);
    if (isMatch) return user;
  }
}
