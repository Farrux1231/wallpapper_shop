import mysql from"mysql2/promise";


const db = await mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"5779",
    database:"shop"
});

export default db;