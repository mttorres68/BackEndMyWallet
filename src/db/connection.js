import dotenv from "dotenv";
import pg from "pg";
import { createTable } from "../query.js";
const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  host: "ubuntu.expectonautas.online",
  user: "postgres",
  password: "Mun2v@1c2d3",
  database: "my_wallet",
  port: "5432",
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});


const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
    await createTable()
  } catch (err) {
    console.error("Error connecting to the database", err);
    process.exit(-1);
  }
};

export { pool as con, connectDB };

// async function getAll(){
//   const rows = await con.query("SELECT * FROM onu");
//   return rows[0]
// }

// const onu = await getAll()

// console.log(onu());

// const endConnection = async () => {
//   con.end((err) => {
//     if(err) {
//       console.error('Error while closing connection: ', err.stack);
//       process.exit[1];
//     }

//     console.log('Connection Closed Successfully');
//     return con;
//   })
// }

// export {connectDB, endConnection}
