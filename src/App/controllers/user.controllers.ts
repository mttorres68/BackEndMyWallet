import { Request, Response } from "express";
/* 
import { deleteUsers } from "../useCases/Users/delete";
*/
import { findAllUser } from "../useCases/Users/findAll";
import { updateUser } from "../useCases/Users/update";
import { createUser } from "../useCases/Users/create";
import { CustomRequest } from "../../middleware/verifyJWT";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

/**
 * @description Controller for User
 */

class UserController {
  async create(request: Request, response: Response): Promise<void> {
    const { firstName, lastName, phoneNumber, email, password } =
      request.body as User;

    if (!firstName && !lastName) {
      response.status(400).json({ error: "Name is required!" });
      return;
    }

    if (!email) {
      response.status(400).json({ error: "Em email required!" });
      return;
    }

    if (!password) {
      response.status(400).json({ error: "Password is required!" });
      return;
    }

    const user = await createUser({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    });

    response.status(201).json(user);
    return;
  }

  async update(request: CustomRequest, response: Response) {
    const id = request.user?.uid;
    console.log(id);

    if (request.user?.uid !== id) {
      console.log(request.user?.uid);

      response
        .status(403)
        .json({ error: "You do not have permission to update this user" });
      return;
    }

    const { firstName, lastName, email, phoneNumber } = request.body as User;

    // retornar apenas os dados atualizados

    if (id) {
      const user = await updateUser(
        id,
        firstName,
        lastName,
        email,
        phoneNumber as string
      );

      response.status(200).json(user);
    }
  }

  async getAll(request: Request, response: Response): Promise<void> {
    const users = await findAllUser();

    response.status(200).json(users);
  }
}

export default new UserController();
