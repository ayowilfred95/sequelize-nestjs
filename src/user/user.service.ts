import { Injectable } from '@nestjs/common';
import { UserDAO } from '../dao/user.dao';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersDAO: UserDAO) {}

  async register(data:CreateUserDto ): Promise<any> {
    try {
      const emailExist = await this.usersDAO.exist({email:data.email});
      if (emailExist) {
        return { message: 'Email already exist' };
      }

      const user = await this.usersDAO.create(data);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
