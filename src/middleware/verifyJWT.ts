import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";

import { JWT_SECRET } from "../utils/constants";

export interface CustomRequest extends Request {
  user?: User;
  token?: string;
}

function verifyJWT(
  request: CustomRequest,
  response: Response,
  next: NextFunction
): void {
  const authToken: string = request.cookies.refreshToken;

  try {
    if (!authToken) {
      response.status(401).json({ auth: false, message: "Token is missing" });
    }

    jwt.verify(authToken, JWT_SECRET!, function (err, decoded) {
      if (err) {
        response.status(401).json({
          auth: false,
          message: "Token invalid.",
        });
        return;
      }

      const payload = decoded as JwtPayload;
      if (!request.user) request.user = {} as User;

      request.user.uid = payload.id;
      request.user.email = payload.email;

      next();
    });
  } catch (error) {
    console.error("Erro durante a verificação do token:", error);
    response
      .status(500)
      .json({ auth: false, message: "Internal server error" });
    return;
  }
}

export { verifyJWT };
