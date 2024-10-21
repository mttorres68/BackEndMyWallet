import dotenv from "dotenv"
dotenv.config()

export const JWT_SECRET = process.env.SECRET as string

export const ACCESS_TOKEN = "accessToken"
export const REFRESH_TOKEN = "refreshToken"
