import { User } from "@prisma/client"
import UserRepository from "../../repositories/userRepositories"
import {
  ConflictError,
  InternalServerError
} from "../../../helpers/ApiExceptions"

interface UserProps {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  password: string
}

export async function createUser({
  firstName,
  lastName,
  email,
  phoneNumber,
  password
}: UserProps): Promise<User> {
  const existsEmail = await UserRepository.findByEmail(email)

  if (existsEmail?.email === email) {
    throw new ConflictError(
      "Unable to create user. Please verify your information and try again"
    )
  }

  const newUser = await UserRepository.create({
    firstName,
    lastName,
    phoneNumber,
    email,
    password
  })

  if (!newUser) {
    throw new InternalServerError("Error creating user.")
  }

  return newUser
}
