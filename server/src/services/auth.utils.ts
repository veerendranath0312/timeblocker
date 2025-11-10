import {User} from '../models/user.model';
import { UserFactory } from "../models/model.manager";
import { UserRepository } from "../repository/UserRepository";
import { pool } from "../config/pool";

export const findOrCreateUser = async (uid: string, email: string): Promise<User> => {
  const userRepo = new UserRepository(pool);
  let user = await userRepo.findByUid(uid);
  if (!user) {
    user = new UserFactory().createUser(uid, email);
    await userRepo.create(user);
  }
  return user;
};

