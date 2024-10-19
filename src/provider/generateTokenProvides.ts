import jwt from "jsonwebtoken";

class GenerateAccessToken {
  async execute(userId: string) {
    const SECRET = process.env.SECRET as string;
    const token = jwt.sign({ id: userId }, SECRET, {
      subject: userId,
      expiresIn: "30m",
    });

    return token;
  }
}

export default new GenerateAccessToken();
