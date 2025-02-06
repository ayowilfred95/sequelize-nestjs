import * as bcrypt from 'bcrypt';

export const hashGenerate = (string: string): string => {
  const saltRounds = 10;
  return bcrypt.hashSync(string, saltRounds);
};
