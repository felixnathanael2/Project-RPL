import { connectDB } from "../db/db.js";

// controller ketika login
export const login = async (req, res) => {
	// ... (Logika login, mencari user, membandingkan password teks biasa, dan membuat req.session) ...
    const { id, password, role } = req.body;
    let connection;
    try {
        const pool = await connectDB();
        connection = await pool.getConnection();

        let tableName, idColumn, nameColumn;
        if (role === "Mahasiswa") {
            tableName = "Mahasiswa_TA";
            idColumn = "NPM";
            nameColumn = "nama_Mahasiswa";
        } else if (role === "Dosen") {
            tableName = "Dosen_Pembimbing";
            idColumn = "NIK";
            nameColumn = "nama_Dosen";
        } else {
            return res.status(400).json({ message: "Peran tidak valid." });
        }

        const [rows] = await connection.execute(
            `SELECT ${idColumn}, password, ${nameColumn} FROM ${tableName} WHERE ${idColumn} = ?`,
            [id]
        );
        const user = rows[0];

        if (!user || password !== user.password) {
            return res.status(401).json({ message: "ID atau Password salah." });
        }

        req.session.isLoggedIn = true;
        req.session.userId = user[idColumn];
        req.session.role = role;
        req.session.userName = user[nameColumn];

        res.json({
            message: "Login berhasil!",
            user: {
                id: req.session.userId,
                role: req.session.role,
                name: req.session.userName,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server saat login." });
    } finally {
        if (connection) connection.release();
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Gagal logout." });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logout berhasil." });
    });
};