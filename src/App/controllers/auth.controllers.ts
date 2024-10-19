import { NextFunction, Request, Response } from "express";

import generateTokenProvides from "../../provider/generateTokenProvides";
import { ACCESS_TOKEN, JWT_SECRET } from "../../utils/constants";
import verifyToken from "../../utils/tokenUtils";
import { login } from "../useCases/Auth/login";

interface IUser {
  email: string;
  password: string;
}

class AuthController {
  async Auth(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body as IUser;

      if (!email || !password) {
        response.status(400).json({ error: "Email and password is required" });
        return;
      }

      const { accessToken, refreshToken, user } = await login({
        email,
        password,
      });

      const {password: _, ...userWithoutPassword} = user

      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
      });
      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
      });

      response.json({ message: "User logged in successfully", user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  }

  async GenerateToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const refreshToken: string = request.cookies.refreshToken;

    try {
      if (!refreshToken) {
        response.status(401).json({ message: "Refresh token is missing" });
      }

      const decoded = await verifyToken(refreshToken, JWT_SECRET);

      const accessToken = await generateTokenProvides.execute(decoded.id);

      response.cookie(ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
      });

      response.json({ message: "Token refresh successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
