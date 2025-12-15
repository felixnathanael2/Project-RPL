import { connectDB } from "../db/db.js";

export const findUserByEmail = async (email) => {
  const db = await connectDB();
  const query = `
        SELECT id_users, email, nama FROM users
        WHERE email = ?
    `;
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

export const saveResetToken = async (email, token) => {
  const db = await connectDB();
  await db.query("DELETE FROM password_resets WHERE email = ?", [email]);
  const query = `
        INSERT INTO password_resets (email, token, created_at)
        VALUES (?, ?, NOW())
    `;
  return await db.query(query, [email, token]);
};

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

export const updatePassword = async (email, newHashedPassword) => {
  const db = await connectDB();
  const query = `
        UPDATE users
        SET password = ?
        WHERE email = ?
    `;
  await db.query(query, [newHashedPassword, email]);

  const queryLog = `
        INSERT INTO log_aktivitas (id_users, aksi)
        SELECT id_users, 'Berhasil mereset password via Lupa Password'
        FROM users
        WHERE email = ?
  `;

  return await db.query(queryLog, [email]);
};

export const deleteToken = async (email) => {
  const db = await connectDB();
  const query = `DELETE FROM password_resets WHERE email = ?`;
  return await db.query(query, [email]);
};
