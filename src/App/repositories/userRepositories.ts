import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prisma";


class UserRepository {
  async findAll() {
    try {
      const allUsers = await prisma.user.findMany();
      return allUsers;
    } catch (err) {
      console.log(err);
    }
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findByID(uid: string) {
    try {
      const user = await prisma.user.findUnique({ where: { uid } });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      const randomSalt = crypto.randomInt(10, 16);
      const passwordHash = await bcrypt.hash(data.password, randomSalt);
      const newUser = await prisma.user.create({
        data: {
          ...data,
          password: passwordHash,
        },
      });

      return newUser;
    } catch (err) {
      console.log(err);
    }
  }

  async update(uid: string, data: Prisma.UserUpdateInput ) {
    try {
      const {firstName, lastName, email, phoneNumber} = await prisma.user.update({
        where: { uid },
        data,
      });

      return {firstName, lastName, email, phoneNumber};
    } catch (error) {
      console.log(error);
    }
  }

  async delete(uid: string) {
    return await prisma.user.delete({ where: { uid } });
  }
}

export default new UserRepository();
