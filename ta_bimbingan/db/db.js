// db.js
import mysql from "mysql2/promise";
import "dotenv/config";

// Ambil konfigurasi dari .env
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Objek yang mengelola koneksi
// jadi pool itu koneksi ke db yang terbuka terus dan dikelola aplikasinya,
// jadi tiap kali mau pake db, gaperlu buka tutup koneksi, tinggal pake koneksi dari pool itu aja
// sebenernya kalo aplikasinya kecil kek bimbingan ta mah gaperlu kyknya tapi gapapa nyoba nyoba
const pool = mysql.createPool(config);

// trus ini kalo mau ambil pool nya pake method connectDB ini
export async function connectDB() {
    // Fungsi ini mengembalikan pool, siap digunakan
    return pool;
}