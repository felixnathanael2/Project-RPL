// index.js (type: module)
import "dotenv/config";
import express from "express";
import session from "express-session";
import { connectDB } from "./db.js";
import { getRiwayatBimbingan, getDosen, getUnavailable, createPengajuan, getLokasi } from "./services/bimbinganServices.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ... (Middleware Global & Session setup, sama seperti sebelumnya) ...
app.use(express.json());
app.use(express.static("public"));

//secret: Ini adalah Tanda Tangan Digital. String rahasia yang digunakan untuk menyegel cookie sesi agar tidak bisa dipalsukan oleh hacker.
//resave: false: Efisiensi. Artinya: "Kalau sesi user gak ada yang berubah (dia cuma diem aja), gak usah simpan ulang ke database." Ini menghemat kinerja server.
//saveUninitialized: false: Hemat Tempat & Privasi. Artinya: "Kalau ada orang asing lewat (visit) tapi belum login (belum ada data sesi yang disimpan), jangan buatkan dia sesi di database." Kita cuma buat sesi kalau dia sudah berhasil login.
//cookie: { maxAge: ... }: Kedaluwarsa Kartu Tamu. Menentukan berapa lama cookie sesi itu valid di browser user. Di sini diset 24 jam (1000 ms * 60 dtk * 60 mnt * 24 jam).
app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback_secret_key_yang_sangat_panjang",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);

// Middleware Proteksi
// cek dlu udah login apa belum, kalo belom ya gabisa ngapa ngapain
function protectRoute(req, res, next) {
    if (req.session.isLoggedIn) {
        req.user = { id: req.session.userId, role: req.session.role };
        next();
    } else {
        res
            .status(403)
            .json({ message: "Akses ditolak. Silakan login terlebih dahulu." });
    }
}

// ROUTE LOGIN
app.post("/login", async (req, res) => {
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
});

// ROUTE LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Gagal logout." });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logout berhasil." });
    });
});

// ROUTE RIWAYAT BIMBINGAN (Terproteksi)
app.get("/riwayat", protectRoute, async (req, res) => {
    try {
        const riwayat = await getRiwayatBimbingan(req.user.id, req.user.role);
        res.json({
            message: `Riwayat Bimbingan untuk ${req.user.role} (Auth Sesi)`,
            data: riwayat,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// INI ROUTE BUAT BAGIAN PENGAJUAN BIMBINGAN
// ---------------------------------------------------------

// ini get buat ambil mahasiswa sama dosen, pas form baru dibuka manggil route ini
app.get('/pengajuan-init', protectRoute, async (req, res) => {
    try {
        const userId = req.user.id;
        const lokasi = await getLokasi();
        const dosen = await getDosen(userId);

        // kirim hasilnya ke frontend
        res.json({ lokasi, dosen });
    } catch (e) {
        // statements
        res.status(500).json({ message: 'Gagal ambil data' });
    }
});

// ini get buat cek waktu, dipanggil kalo ganti button ato ganti tanggal
app.get('/check-availability', protectRoute, async (req, res) => {
    // ambil tanggal dan dosen ybs dari query di browser nya
    // query tuh mksdnya yg kyk ...?date=2025-11-20&dosenIds=123,456
    const { date, nik } = req.query;

    // kalo di front end nya ga di default data ininya, drpd error
    if (!date || !nik) return res.json({ availableSlots: [] });

    try {
        const dosenArray = nik.split(",");

        // bikin semua kemungkinan slot jam (7-17 (jam kerja))
        const rangeJam = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

        // ambil slot yang udah keiisi (sibuk) dari db
        const sibuk = await getUnavailable(date, dosenArray, req.user.id);

        // di filter buat cari jam berapa aja yang available
        // konsep filter tuh jadi, coba loop dari semua rangeJam, terus masukin jam dengan kondisi => ...
        // kondisinya itu berarti masukin jam, kalo misalnya di sibuk tuh gada jam itu, kalo misal ada jadi gausa dimasukkin
        const jamAvailable = rangeJam.filter(jam => !sibuk.includes(jam));

        //return si data json nya
        res.json({ jamAvailable });
    } catch (e) {
        // statements
        console.log(e);
    }
});

// route buat pas submit form nya
app.post('/ajukan-bimbingan', protectRoute, async (req, res) => {
    try {
        // masukin hasil dari form itu ke variabel, ini sama aja kek manual const tanggal = req.body.tanggal, dst
        const { tanggal, jam, lokasiId, nik } = req.body;

        await createPengajuan({ tanggal, jam, lokasiId, nik, npm: req.user.id });

        res.json({ message: 'Pengajuan berhasil' });
    } catch (e) {
        // statements
        console.log(e);
        res.status(500).json({ message: 'Gagal submit' });
    }
});

// Route Utama & Start Server
app.get("/", (req, res) => {
    res.redirect("/index.html");
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
