import { con } from "./db/connection.js"
import bcrypt from "bcrypt"

/**
 * @description Registrar um novo usuário no banco de dados
 * @query INSERT INTO user (name, email, password)
 */
const addUser = async (name, email, password) => {
  const exist = await verifyExistEmail(email)
  if (exist.length === 0) {
    try {
      const query = await con.query(
        `
        INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3)  RETURNING user_id;`,
        [name, email, password]
      )

      return query.rows[0]
    } catch (error) {
      console.error("Erro ao criar usuário: ", error)
    }
  } else {
    return []
  }
}

/**
 * @description Buscar dados do usuário por 'user_id'
 * @query SELECT * FROM user
 */
const getUserInfo = async (id) => {
  const info = await con.query(`SELECT * FROM "user" WHERE user_id = $1`, [id])

  return info.rows[0]
}

/**
 * @description Verificar se o 'email' já não está registrado no bando de dados, pois foi definido como 'unique'
 * @query SELECT * FROM user WHERE email
 */
const verifyExistEmail = async (email) => {
  const query = await con.query(`SELECT * FROM "user" WHERE email = $1`, [
    email
  ])
  return query.rows
}

/**
 * @description Verificar se os dados passados para fazer login estão corretos
 * @query SELECT password, user_id FROM user WHERE email
 */
const verifyUser = async (email, password) => {
  try {
    const query = await con.query(
      `SELECT password, user_id FROM "user" WHERE email = $1`,
      [email]
    )

    if (query.rows[0] === undefined) {
      return { valid: false }
    }
    const isValidPassword = await bcrypt.compare(
      password,
      query.rows[0].password
    )
    const user_id = query.rows[0].user_id

    const response = {
      user_id: user_id,
      valid: isValidPassword
    }
    return response
  } catch (err) {
    return err.message
  }
}

const createTable = async () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS "user" (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );`

  try {
    const queryUser = await con.query(createUserTable)
    if (queryUser.warningCount === 0) {
      console.log("Tabela 'user' criada com sucesso!")
    }
  } catch (error) {
    console.error("Erro ao criar tabelas: ", error)
  }
}

export { addUser, verifyUser, getUserInfo, createTable }
