import jwt from "jsonwebtoken"

class GenerateRefreshToken {
  async execute(userId: string) {
    const SECRET = process.env.SECRET as string
    const token = jwt.sign({ id: userId }, SECRET, {
      subject: userId,
      expiresIn: "7d"
    })

    return token
  }
}

export default new GenerateRefreshToken()
