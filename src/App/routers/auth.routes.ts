import { Router } from "express"
import authControllers from "../controllers/auth.controllers"

const authRouter = Router()

authRouter.post("/login", authControllers.Auth)
authRouter.get("/token", authControllers.GenerateToken)

export default authRouter
