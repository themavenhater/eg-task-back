import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';
// import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: MongoRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create({ email, hashedPass, fullName }) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (user) {
      throw new ConflictException('user already exists');
    }

    const newUser = await this.userRepo.save({
      email,
      fullName,
      hashedPass,
    });
    return newUser;
  }

  async findMe(token: string) {
    const tokenParts = token.split(' ');
    const decoded = this.jwtService.decode(tokenParts[1]);

    if (!decoded['userId']) {
      throw new BadRequestException('invalid token');
    }
    const user = await this.userRepo.findOne({
      where: { _id: new ObjectId(decoded['userId']) },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return {
      fullName: user.fullName,
      email: user.email,
      userId: user._id,
      createdAt: user.createdAt,
    };
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    return user;
  }
}
