import { connectDB } from "../db/db.js";

// Cek email
export const findUserByEmail = async (email) => {
  const db = await connectDB();
  const query = `
        SELECT id_users, email, nama FROM users
        WHERE email = ?
    `;
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

// Simpan Token Reset Password
export const saveResetToken = async (email, token) => {
  const db = await connectDB();
  // Hapus token lama
  await db.query("DELETE FROM password_resets WHERE email = ?", [email]);
  const query = `
        INSERT INTO password_resets (email, token, created_at)
        VALUES (?, ?, NOW())
    `;
  return await db.query(query, [email, token]);
};

// Ambil Token untuk Validasi
export const getTokenByEmail = async (email) => {
  const db = await connectDB();
  const query = `
        SELECT token, created_at
        FROM password_resets
        WHERE email = ?
        ORDER BY created_at DESC LIMIT 1
    `;
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

// Update Password Baru
export const updatePassword = async (email, newHashedPassword) => {
  const db = await connectDB();
  const query = `
        UPDATE users
        SET password = ?
        WHERE email = ?
    `;
  return await db.query(query, [newHashedPassword, email]);
};

// Hapus Token setelah password berhasil diganti
export const deleteToken = async (email) => {
  const db = await connectDB();
  const query = `DELETE FROM password_resets WHERE email = ?`;
  return await db.query(query, [email]);
};
