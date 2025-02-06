import { Injectable } from '@nestjs/common';
import { Op, Transaction, FindOptions, ModelStatic, Model ,} from 'sequelize';
import { WhereOptions, Includeable, Order, FindAndCountOptions, CreateOptions, UpdateOptions, DestroyOptions } from "sequelize";
import { MakeNullishOptional } from 'sequelize/types/utils';
import { sequelize } from '../models' 
// const {sequelize} = require('../models')


interface CustomFindOptions<T> extends FindOptions<T> {
    scope?: string | string[];
    page?: number;
    limit?: number;
  }

//   type MyMakeNullishOptional<T> = {
//     [P in keyof T]?: T[P] | null;
//   };
  
@Injectable()
export class BaseDAO<T extends Model> {
  private transaction: Transaction | null = null;
  private model: ModelStatic<T>;

  constructor(model:  ModelStatic<T>) {
    this.model = model;
  }

  // Use a transaction in queries
  useTransaction(transaction: Transaction): void {
    this.transaction = transaction;
  }

  // Get the current transaction or start a new one
  async getTransaction(): Promise<Transaction> {
    if (!this.transaction) {
      console.log('Starting new transaction....');
      return await sequelize.transaction(); 
    }
    return this.transaction;
  }

 // Commit the current transaction
 async commitTransaction(): Promise<void> {
    if (this.transaction) {
      console.log('Committing....');
      await this.transaction.commit(); // Commit the current transaction
    }
  }

 // Rollback the current transaction
 async rollbackTransaction(): Promise<void> {
    if (this.transaction) {
      console.log('Rolling back....');
      await this.transaction.rollback(); // Rollback the current transaction
    }
  }
 // Fetch one record with a scope (and other query params)
 async fetchOne(where: Record<string, any> = {}, options: CustomFindOptions<T> = {}): Promise<T | null> {
    try {
      const queryOptions: CustomFindOptions<T> = {
        ...options,
        where: this.createWhere(where),
        nest: true,
      };

      if (options.scope) {
        return await this.model.scope(options.scope).findOne(queryOptions);
      }
      
      return await this.model.findOne(queryOptions);
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching one record');
    }
  }

  
  // Fetch all records with scope (and other query params)
  async fetchAll(where: Record<string, any> = {}, options: CustomFindOptions<T> = {}): Promise<{ data: T[]; pagination?: any }> {
    try {
      const queryOptions: CustomFindOptions<T> = {
        ...options,
        where: this.createWhere(where),
        nest: true,
        distinct: true,
      } as CustomFindOptions<T> ;

      if (options.limit && options.page) {
        queryOptions.offset = (options.page - 1) * options.limit; // Calculate offset based on page and limit
        queryOptions.limit = options.limit; // Ensure limit is passed as well
      }

      const result = options.scope
        ? await this.model.scope(options.scope).findAndCountAll(queryOptions)
        : await this.model.findAndCountAll(queryOptions);

      const response = {
        data: result.rows,
      };

      if (options.limit && options.page) {
        response['pagination'] = {
          limit: options.limit,
          page: options.page,
          pages: Math.ceil(result.count / options.limit),
          rows: result.count,
        };
      }

      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching records');
    }
  }

  // Utility methods for building query parts
  createWhere(query: Record<string, any>) {
    const where: Record<string, any> = {};

    Object.entries(query).forEach(([key, value]) => {
      const operator = 'eq';
      let item = key;

      if (key.includes('.')) {
        item = `$${key}$`; // Support for nested fields
      }

      where[item] = { [Op[operator]]: value };
    });

    return where;
  }

  // Utility method to create includes (associations)
  createInclude(associations: any[]) {
    return associations.map((item) => ({
      association: item,
    }));
  }

  // Utility method to create the order array for queries
  createOrder(order: Record<string, string>) {
    return Object.entries(order).map(([key, value]) => [key, value]);
  }
// Method to count records with optional where condition
async count(where: Record<string, any> | null = null): Promise<number> {
    try {
      const data = where ? { where: this.createWhere(where) } : {};
      const count = await this.model.count(data);
      return count;
    } catch (error) {
      throw new Error('Error counting records');
    }
  }

  // Method to count records based on a specific column
  async countCol(col: string, where: Record<string, any> | null = null): Promise<number> {
    try {
      const data = {
        col,
        distinct: true,
        ...(where && { where: this.createWhere(where) }),
      };
      const count = await this.model.count(data);
      return count;
    } catch (error) {
      throw new Error('Error counting column');
    }
  }

  // Method to sum a field based on where condition
  async sum(field: string, where: Record<string, any> | null = null): Promise<number> {
    try {
      const data = where ? { where: this.createWhere(where) } : {};
      const sum = await this.model.sum(field, data);
      return sum;
    } catch (error) {
      throw new Error('Error summing field');
    }
  }

  // Method to create a new record
  async create(data: MakeNullishOptional<T["_creationAttributes"]>): Promise<T> {
    try {
      const newEntry = await this.model.create(data);
      return newEntry;
    } catch (error) {
      throw new Error('Error creating record');
    }
  }

  // Method for bulk creating records
  async bulkCreate(data: MakeNullishOptional<T["_creationAttributes"]>[]): Promise<T[]> {
    try {
      const newEntries = await this.model.bulkCreate(data);
      return newEntries;
    } catch (error) {
      throw new Error('Error bulk creating records');
    }
  }

  // Method to update a record
  async update(data: Record<string, any>, where: Record<string, any>): Promise<T> {
    try {
      const updatedEntry = await this.model.update(data, {
        where: this.createWhere(where),
        returning: true,
      });
      return updatedEntry[1][0] || await this.fetchOne(where); 
    } catch (error) {
      throw new Error('Error updating record');
    }
  }

  // Method to delete a record
  async delete(where: Record<string, any>): Promise<number> {
    try {
      const deleted = await this.model.destroy({
        where: this.createWhere(where),
      });
      return deleted;
    } catch (error) {
      throw new Error('Error deleting record');
    }
  }

  

  // Method to check if a record exists
  async exist(where: Record<string, any>): Promise<boolean> {
    try {
      const item = await this.model.findOne({
        where: this.createWhere(where),
      });
      return item ? true : false;
    } catch (error) {
      throw new Error('Error checking existence');
    }
  }

}

// class BaseDAO<T extends Model> {
//   private model: typeof Model;
//   private transaction?: Transaction;

//   constructor(model: typeof Model) {
//     this.model = model;
//   }

//   useTransaction(transaction: Transaction): void {
//     this.transaction = transaction;
//   }

//   async getTransaction(): Promise<Transaction> {
//     if (!this.transaction) {
//       console.log('Starting new transaction....');
//       return await sequelize.transaction();
//     } else {
//       return this.transaction;
//     }
//   }

//   async commitTransaction(t: Transaction): Promise<void> {
//     if (!this.transaction) {
//       console.log('Committing....');
//       await t.commit();
//     }
//   }

//   async rollbackTransaction(t: Transaction): Promise<void> {
//     if (!this.transaction) {
//       console.log('Rolling back....');
//       await t.rollback();
//     }
//   }

//   async fetchOne(
//     where: WhereOptions | null = null,
//     options: { scope?: string; attributes?: string[]; include?: Includeable[]; order?: Order } = {}
//   ): Promise<T | null> {
//     try {
//       const data: FindAndCountOptions = { nest: true };
//       if (where) data.where = this.createWhere(where);
//       if (options.attributes) data.attributes = options.attributes;
//       if (options.include) data.include = this.createInclude(options.include);
//       if (options.order) data.order = this.createOrder(options.order);

//       const item = options.scope
//         ? await this.model.scope(options.scope).findOne(data)
//         : await this.model.findOne(data);

//       return item?.get() as T | null;
//     } catch (error) {
//       throw appError(error);
//     }
//   }

//   async fetchAll(
//     where: WhereOptions | null = null,
//     options: { scope?: string; attributes?: string[]; include?: Includeable[]; order?: Order; limit?: number; page?: number } = {}
//   ): Promise<{ data: T[]; pagination?: { limit: number; page: number; pages: number; rows: number } }> {
//     try {
//       const data: FindAndCountOptions = { nest: true, distinct: true };
//       if (where) data.where = this.createWhere(where);
//       if (options.attributes) data.attributes = options.attributes;
//       if (options.include) data.include = this.createInclude(options.include);
//       if (options.limit) {
//         data.limit = Number(options.limit);
//         if (options.page) data.offset = ((Number(options.page) - 1) * Number(options.limit));
//       }
//       if (options.order) data.order = this.createOrder(options.order);

//       const result = options.scope
//         ? await this.model.scope(options.scope).findAndCountAll(data)
//         : await this.model.findAndCountAll(data);

//       const response: { data: T[]; pagination?: { limit: number; page: number; pages: number; rows: number } } = {
//         data: result.rows as T[],
//       };

//       if (options.limit && options.page) {
//         response.pagination = {
//           limit: options.limit,
//           page: options.page,
//           pages: Math.ceil(result.count / options.limit),
//           rows: result.count,
//         };
//       }

//       return response;
//     } catch (error) {
//       throw appError(error);
//     }
//   }

//   async count(where: WhereOptions | null = null): Promise<number> {
//     try {
//       const data: { where?: WhereOptions } = {};
//       if (where) data.where = this.createWhere(where);
//       return await this.model.count(data);
//     } catch (error) {
//       throw appError(error);
//     }
//   }

//   async countCol(col: string, where: WhereOptions | null = null): Promise<number> {
//     try {
//       const data: { col: string; distinct: boolean; where?: WhereOptions } = { col, distinct: true };
//       if (where) data.where = this.createWhere(where);
//       return await this.model.count(data);
//     } catch (error) {
//       throw new Error('Error checking existence');
//     }
//   }
// }
