import { connectDB } from "../db/db.js";

export const updatePassword = async (idUsers, hashedPassword) => {
    const db = await connectDB();
    const query = `UPDATE users SET password = ? WHERE id_users = ?`;
    const [result] = await db.execute(query, [hashedPassword, idUsers]);
    return result;
};

export const findUserById = async (idUsers) => {
    const db = await connectDB();
    const query = `SELECT id_users, email, nama, role FROM users WHERE id_users = ?`;
    const [rows] = await db.execute(query, [idUsers]);
    return rows[0];
};

export const findAllUsers = async () => {
    const db = await connectDB();
    const query = `
        SELECT 
            u.id_users, 
            u.email, 
            u.nama, 
            u.role,
            CASE 
                WHEN u.role = 1 THEN 'Mahasiswa'
                WHEN u.role = 2 THEN 'Dosen'
                WHEN u.role = 3 THEN 'Admin'
                ELSE 'Unknown'
            END as status_text,
            d.semester,
            d.topik
        FROM users u
        LEFT JOIN data_ta d ON u.id_users = d.id_users
        ORDER BY u.role DESC, u.nama ASC
    `;
    const [rows] = await db.execute(query);
    return rows;
};