import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/')
  @UseGuards(JwtAuthGuard)
  findMe(@Request() req) {
    const authorizationHeader = req.headers.authorization;
    return this.userService.findMe(authorizationHeader);
  }
}
