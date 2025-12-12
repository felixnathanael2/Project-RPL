// index.js (type: module)
import "dotenv/config";
import express from "express";
import session from "express-session";
import routes from "./routes/routes.js";
import { connectDB } from "./db/db.js";
import * as dosenService from "./services/dosenService.js";

const app = express();
const PORT = process.env.PORT || 3000;

//setup view engine
app.set("view engine", "ejs");
app.set("views", "./private");

// ... (Middleware Global & Session setup, sama seperti sebelumnya) ...
app.use(express.json());

app.use(express.static("public"));

//secret: Ini adalah Tanda Tangan Digital. String rahasia yang digunakan untuk menyegel cookie sesi agar tidak bisa dipalsukan oleh hacker.
//resave: false: Efisiensi. Artinya: "Kalau sesi user gak ada yang berubah (dia cuma diem aja), gak usah simpan ulang ke database." Ini menghemat kinerja server.
//saveUninitialized: false: Hemat Tempat & Privasi. Artinya: "Kalau ada orang asing lewat (visit) tapi belum login (belum ada data sesi yang disimpan), jangan buatkan dia sesi di database." Kita cuma buat sesi kalau dia sudah berhasil login.
//cookie: { maxAge: ... }: Kedaluwarsa Kartu Tamu. Menentukan berapa lama cookie sesi itu valid di browser user. Di sini diset 24 jam (1000 ms * 60 dtk * 60 mnt * 24 jam).
app.use(
    session({
        secret:
            process.env.SESSION_SECRET || "fallback_secret_key_yang_sangat_panjang",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 Jam
    })
);

// Route Utama & Start Server
app.get("/", (req, res) => {
    cekBimbinganExpired();

    if (req.session.isLoggedIn) {
        return res.redirect("/dashboard");
    }
    return res.redirect("/login");
});

app.use(routes);

async function cekBimbinganExpired() {
    //kalo bimbingan udah lewat waktunya maka akan diset jadi selesai
    try {
        const pool = await connectDB();
        const query = `
            UPDATE bimbingan
            SET status = 'Selesai'
            WHERE TIMESTAMP(tanggal, waktu) < NOW() 
        AND status = 'Disetujui';
        `;

        const [result] = await pool.execute(query);

        // [FIX] Mengganti fetch dengan logika langsung
        // Alasan: Fetch ke localhost sering gagal karena butuh token Auth & URL lengkap.
        // Kita panggil logika update eligible langsung disini.

        const allDosen = await dosenService.getAllDosen();

        // Gunakan Promise.all agar update berjalan paralel untuk semua dosen
        const updatePromises = allDosen.map(dosen =>
            dosenService.getStatistikKelayakan(dosen.id_users)
        );

        await Promise.all(updatePromises);
        // console.log("System Update: Data Eligible berhasil diperbarui.");

    } catch (error) {
        console.error(" Gagal update bimbingan:", error);
    }
}

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});