import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import db from "./db.js";

const app = express();
const PORT = 3000;

// Serve index.html ketika dibuka
app.use(express.static("public"));

// Multer: save file yang di upload ke folder "uploads/"
const storage = multer.diskStorage({

    // destination dari file yang akan di upload
    // req = request HTTP
    // file = informasi file
    // cb = callback
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },

    // inituh biar nama file yang disimpen nya ngikutin nama file aslinya
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

// Upload endpoint, pake async karena pake await
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "upload .xlsx file" });
    }

    // baca XLSX file dari disk
    const workbook = XLSX.readFile(req.file.path);

    // baca sheet pertama (asumsi jadwal ada di sheet pertama)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // convert dari sheet itu ke json
    const data = XLSX.utils.sheet_to_json(sheet);

    // ini overwrite semua record dari si tabel, dummy aja klo logic aslinya bakal overwrite tergantung user mana (pake WHERE)
    await db.execute("DELETE FROM jadwal_user");

    // loop buat ngambilin data, terus di insert ke db nya
    let inserted = 0;
    for (const row of data) {
        // statement
        const hari = row.hari;
        const mulai = row.jam_mulai;
        const akhir = row.jam_akhir;

        // kalo misal ada baris yang invalid, di skip
        if (!hari || !mulai || !akhir) continue;

        await db.execute(
            "INSERT INTO jadwal_user (jam_mulai, jam_akhir, hari) VALUES (?,?,?)",
            [mulai, akhir, hari]
        );

        inserted++;
    }

    return res.json({
        message: "XLSX converted to JSON, Inserted to MySQL",
        rows_in_file: data.length,
        rows_inserted: inserted
    });
});

// route lain nyoba nyoba
app.get("/", (req, res) => res.send("Hello from Express!"));
app.get("/about", (req, res) => res.send("Hi my name is Gregorius Jason Maresi (GJM)"));
app.get("/contact", (req, res) => res.send("contact me at gjsonm@gmail.com"));
app.get("/user/:id", (req, res) => res.send(`User ID: ${req.params.id}`));
app.get("/search", (req, res) => res.send(`You search for: ${req.query.q}`));

// jalanin servernya
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});