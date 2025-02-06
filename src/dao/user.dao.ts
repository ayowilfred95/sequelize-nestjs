import { Injectable } from '@nestjs/common';
import { User } from '../models/user'
import { BaseDAO } from './base.dao';

@Injectable()
export class UserDAO extends BaseDAO<User> {
    constructor() {
        super(User);  
    }
}


