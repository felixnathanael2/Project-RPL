import { connectDB } from "../db/db.js";

// controller ketika login
export const login = async (req, res) => {
  //debugging
  console.log("REQ.BODY =", req.body);

  const { email, password } = req.body;
  let connection;
  try {
    const pool = await connectDB();
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT id_users, password, nama, role FROM users WHERE email = ?`,
      [email]
    );

    const user = rows[0];

    if (!user || password !== user.password) {
      return res.status(401).json({ message: "ID atau Password salah." });
    }

    req.session.isLoggedIn = true;
    req.session.userId = user.id_users;
    req.session.email = email;
    req.session.role = user.role;
    req.session.userName = user.nama;

    //masukkan ke log kalo berhasil
    const queryLog = `INSERT INTO log_aktivitas (id_users, aksi) VALUES (?, ?)`;
    await connection.execute(queryLog, [user.id_users, "LOGIN"]);

    res.json({
      message: "Login berhasil!",
      user: {
        id: req.session.userId,
        email: req.session.email,
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