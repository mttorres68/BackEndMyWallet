import UserRepository from "../../App/repositories/UserRepositories";

export async function deleteSchedules(id: string) {
  const existsSchedule = await UserRepository.findByID(id);

  if (!existsSchedule) {
    throw new Error("Schedule does not exists");
  }

  await UserRepository.delete(id);

  return;
}
