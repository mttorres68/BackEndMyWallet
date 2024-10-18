import { Request, Response } from "express";
/* 
import { findAllUsers } from "../useCases/Users/findAll";
import { deleteUsers } from "../useCases/Users/delete";
*/
import { updateUser } from "../useCases/Users/update";
import { createUser } from "../useCases/Users/create";

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

  async update(request: Request, response: Response){
    const { id } = request.params;

    const { firstName, lastName, phoneNumber, email } = request.body as User;

    // retornar apenas os dados atualizados
    
    const user = await updateUser(
      id,
      firstName,
      lastName,
      phoneNumber as string,
      email
    );

    response.status(200).json(user);


  }
}

export default new UserController();
