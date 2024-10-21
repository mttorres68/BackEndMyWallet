import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/constants"

class GenerateAccessToken {
  execute(userId: string): string {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET não está definido")
    }
    // const SECRET = process.env.SECRET as string;
    const token = jwt.sign({ id: userId }, JWT_SECRET, {
      subject: userId,
      expiresIn: "30m"
    })

    return token
  }
}

export default new GenerateAccessToken()
