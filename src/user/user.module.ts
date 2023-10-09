import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import { JwtConfigModule } from 'src/config/typeorm/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),JwtConfigModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}
