import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createUser, getUser } from "./routers/user.js";
import { login } from "./routers/login.js";
import { validateToken } from "./routers/token.js";
import { connectDB } from "./db/connection.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", createUser);
app.use("/login", login);
app.use("/user", getUser);
app.use("/token", validateToken);


app.listen(process.env.PORT, async () => {
  console.log(`Servidor inicializado... porta:${process.env.PORT}`);
  connectDB()

});
