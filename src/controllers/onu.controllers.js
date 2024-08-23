import {con} from "../db/connection.js";

/**
 * @description Get All onu
 * @route GET /onus 
*/


async function getAll(){
   const rows = await con.query("SELECT * FROM onu");
   return rows[0]
}



async function getOnu(sn){
   const rows = await con.query("SELECT * FROM onu WHERE sn = ?", [sn])
   return rows[0]
}


export {getAll, getOnu}