import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./App/routers/index";
import prisma from "./prisma/prisma";
import { errorMiddleware } from "./middleware/exceptionsMiddleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(error, req, res, next);
});

app.listen(PORT, async () => {
  console.log(`Servidor inicializado... porta:${PORT}`);

  try {
    await prisma.$connect();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
