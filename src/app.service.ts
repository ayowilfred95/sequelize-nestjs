import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Inject } from '@nestjs/common';
import { SEQUELIZE } from  './core/constants/index'; 


@Injectable()
export class AppService {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}
  getHello(): string {
    return 'Hello World Welcome!';
  }

}
