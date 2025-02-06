import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDAO } from '../dao/user.dao'


@Module({
  controllers: [UserController],
  providers: [UserService, UserDAO],
})
export class UserModule {}
