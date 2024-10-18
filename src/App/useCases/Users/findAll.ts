import UserRepository from "../../repositories/userRepositories";


export async function findAllUser() {
  const allUser = await UserRepository.findAll();

  return allUser;
}
