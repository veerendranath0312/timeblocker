import { pool } from '../config/pool';
import { UserRepository } from "../repository/UserRepository";
import { firebaseDeleteUserByEmail } from "../firebase/firebaseUser";

export async function resetDB(email: string) {
  await firebaseDeleteUserByEmail(email);
  await new UserRepository(pool).deleteByEmail(email);
}
