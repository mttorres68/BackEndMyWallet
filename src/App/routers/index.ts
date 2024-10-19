import { Router } from "express";
import userRoutes from "./user.routes";
import authRouter from "./auth.routes";

const routes = Router();

routes.use("/api/user", userRoutes);
routes.use("/api/auth", authRouter);

export default routes;
