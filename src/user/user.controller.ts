import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('/users/register')
    async register(@Body() createUserDto: CreateUserDto) {
      try {
        // Call the service to handle user registration
        const result = await this.userService.register(createUserDto);
        return result;
      } catch (error) {
        return {
          message: 'An error occurred while registering the user.',
          error: error.message,
        };
      }
    }

}
