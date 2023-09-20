import { CreateUserDto } from "../dto";
import { User } from "../entities/users";
import { AppDataSource } from "../ormconfig";

export const createUser = async ({ name, email, password }: CreateUserDto) => {
  try {
    let user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    await AppDataSource.manager.save(user);
    return user;
  } catch (error) {
    console.error(error);
    return false;
  }
};
