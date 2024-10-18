import { NotFoundError } from "../../../helpers/ApiExceptions";
import userRepositories from "../../repositories/userRepositories";


export async function updateUser(uid: string, firstName: string, lastName: string, email: string, phoneNumber: string) {
  const existsUser = await userRepositories.findByID(uid);

  if (!existsUser) {
    throw new NotFoundError("User does not exists");
  }

  const user = await userRepositories.update(uid, { firstName, lastName,email, phoneNumber });

  return user;
}
