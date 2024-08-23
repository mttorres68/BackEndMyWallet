import { Router } from "express";
import { verifyUser } from "../query.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

/**
 * @description Realizar autenticação do usuário
 * @route POST  /login
 */

export const login = router.post("", async (req, res, next) => {
  const { email, password } = req.body;
  const query = await verifyUser(email, password);
  try {
    if (query.valid === false) {
      res.status(404).json({ message: "Usuário inválido!" });
    } else {
      const id = query.user_id;
      console.log(id);
      
      const token = jwt.sign({ id, email }, process.env.SECRET, {
        expiresIn: "1h",
      });
      console.log('usuário logado');
      
      return res.json({ auth: true, token: token, user_id: id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});
