import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as JwtPayload);
    });
  });
};


export default verifyToken;