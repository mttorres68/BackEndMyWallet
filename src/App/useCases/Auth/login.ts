import bcrypt from "bcrypt"

import { UnauthorizedError } from "../../../helpers/ApiExceptions"
import prisma from "../../../prisma/prisma"
import generateTokenProvides from "../../../provider/generateTokenProvides"
import generateRefreshTokenProvides from "../../../provider/generateRefreshTokenProvides"

interface ILogin {
  email: string
  password: string
}

export async function login({ email, password }: ILogin) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      uid: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true
    }
  })

  if (user?.email !== email) {
    throw new UnauthorizedError("User or password incorrect")
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new UnauthorizedError("User or password incorrect")
  }

  const accessToken = await generateTokenProvides.execute(user.uid)
  const refreshToken = await generateRefreshTokenProvides.execute(user.uid)

  return { accessToken, refreshToken, user }
}
