export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dob?: Date;
    gender?: string;
    photo?: string;
  }
  