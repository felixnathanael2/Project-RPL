import mysql from "mysql2/promise";


// bikin db connection, sesuai in aja sama db masing masing, ini pake mysql
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "ta_bimbingan"
});

console.log("MySQL connected!");

export default db;
