import { NextFunction, Request, Response } from "express"
import { ApiExceptions } from "../helpers/ApiExceptions" // Ajuste o caminho conforme necessário

export const errorMiddleware = (
  error: Error & Partial<ApiExceptions>,
  request: Request,
  response: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  const statusCode = error.statusCode ?? 500
  const message = error.statusCode ? error.message : "Internal Server Error"

  return response.status(statusCode).json({ message })
}
