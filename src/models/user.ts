import { Column, Model, Table, DataType, Scopes } from 'sequelize-typescript';
import { hashGenerate } from '../../lib/helpers/app';

interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dob?: Date;
  gender?: string;
  photo?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isCustomer?: boolean;
  isProvider?: boolean;
  isAdmin?: boolean;
  referrerCode?: string;
  referrerId?: number;
  status?: string;
}

@Scopes(() => ({
  withPassword: {
    attributes: { include: ['password'] },
  },
}))
@Table({
  tableName: 'users',
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
})
export class User extends Model<UserAttributes, Partial<UserAttributes>> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
    set() {
      throw new Error("Virtual field 'displayName' cannot be set directly.");
    },
  })
  displayName: string;

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      if (this.lastName) {
        return `${this.firstName} ${this.lastName.charAt(0)}.`;
      } else {
        return this.firstName;
      }
    },
    set() {
      throw new Error("Virtual field 'shortName' cannot be set directly.");
    },
  })
  shortName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      if (this.email) {
        const emailParts = this.email.split('@');
        return `${emailParts[0].slice(0, 3)}****@${emailParts[1]}`;
      }
      return null;
    },
    set() {
      throw new Error('Do not try to set the `protectedEmail` value!');
    },
  })
  protectedEmail: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string) {
      const hashedPassword = hashGenerate(value);
      this.setDataValue('password', hashedPassword);
    },
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dob: Date;

  @Column({
    type: DataType.STRING,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
  })
  photo: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  emailVerified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  phoneVerified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isCustomer: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isProvider: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAdmin: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  referrerCode: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  referrerId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE',
  })
  status: string;
}
