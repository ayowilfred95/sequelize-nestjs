import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import databaseConfig from './database.config';
import {User} from '../../models/user';
// import { Post } from '../../modules/posts/post.entity';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            let config;
            switch (process.env.NODE_ENV) {
                case DEVELOPMENT:
                    config = databaseConfig.development;
                    break;
                case TEST:
                    config = databaseConfig.test;
                    break;
                case PRODUCTION:
                    config = databaseConfig.production;
                    break;
                default:
                    config = databaseConfig.development;
            }
            const sequelize = new Sequelize(config);
            sequelize.addModels([User]);
            try {
                await sequelize.sync();
                // console.log('Database connected successfully!');
                // console.log("Env used........: ",process.env.NODE_ENV);
            } catch (error) {
                console.error('Error syncing database:', error.message);
                throw error; 
            }
            return sequelize;
        },
    },
];
