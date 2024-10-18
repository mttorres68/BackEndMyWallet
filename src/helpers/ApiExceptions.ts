export class ApiExceptions extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 400 - Bad Request: Indica que a requisição enviada pelo cliente está incorreta ou malformada.
// Exemplo de uso: Quando os dados de entrada fornecidos pelo cliente estão inválidos (ex: campos faltantes ou em formato errado)
export class BadRequestError extends ApiExceptions {
  constructor(message: string) {
    super(message, 400);
  }
}

// 404 - Not Found: Usado quando o recurso solicitado não é encontrado no servidor.
// Exemplo de uso: Quando o cliente tenta acessar um ID de usuário ou rota que não existe.
export class NotFoundError extends ApiExceptions {
  constructor(message: string) {
    super(message, 404);
  }
}


// 401 - Unauthorized: Indica que a autenticação é necessária para acessar o recurso, mas o cliente não forneceu credenciais válidas.
// Exemplo de uso: Quando um usuário não autenticado tenta acessar uma rota que requer login.
export class UnauthorizedError extends ApiExceptions {
  constructor(message: string) {
    super(message, 401);
  }
}


// 409 - Conflict: Usado quando há um conflito com o estado atual do servidor, como uma violação de regra de negócio.
// Exemplo de uso: Quando um cliente tenta registrar um e-mail que já está em uso no sistema.
export class ConflictError extends ApiExceptions {
  constructor(message: string) {
    super(message, 409);
  }
}


// 500 - Internal Server Error: Indica que ocorreu um erro inesperado no servidor.
// Exemplo de uso: Quando o servidor encontra uma exceção inesperada, como falhas no banco de dados ou erros não tratados.
export class InternalServerError extends ApiExceptions{
    constructor(message: string){
        super(message, 500);
    }
}
