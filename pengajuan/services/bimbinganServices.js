import { connectDB } from "../db.js";

// export: di export..biar bisa dipake file lain
// async: asynchronus function
export async function getRiwayatBimbingan(userId, role) {
    let connection;
    try {
        // mengambil pool dan koneksi database dari db.js
        const pool = await connectDB();
        connection = await pool.getConnection();

        // ambil query dari tabel database untuk dapetin history bimbingan
        let query;

        // ini tuh array yang isinya data untuk menggantikan ? di query >>
        let queryParams = [userId];

        // sesuaiin aja dah
        if (role === "Mahasiswa") {
            // ... Query SELECT Mahasiswa JOIN Dosen dan Lokasi ...
            query = `
                SELECT 
                    B.tanggal_Waktu_Bimbingan AS tanggal, 
                    B.catatan_Bimbingan AS catatan, 
                    GROUP_CONCAT(D.nama_Dosen SEPARATOR ', ') AS nama_Dosen, 
                    L.namaRuangan, B.status AS status
                FROM Bimbingan B
                LEFT JOIN Bimbingan_Dosen BD ON B.idBimbingan = BD.idBimbingan
                LEFT JOIN Dosen_Pembimbing D ON BD.NIK = D.NIK
                LEFT JOIN Lokasi L ON B.idLokasi = L.idLokasi
                WHERE B.NPM = ?
                GROUP BY B.idBimbingan
                ORDER BY B.tanggal_Waktu_Bimbingan DESC;
            `;
        } else if (role === "Dosen") {
            // ... Query SELECT Dosen JOIN Mahasiswa dan Lokasi ...
            query = `
                SELECT 
                    B.tanggal_Waktu_Bimbingan AS tanggal, 
                    B.catatan_Bimbingan AS catatan, 
                    M.nama_Mahasiswa, 
                    L.namaRuangan, B.status AS status
                FROM Bimbingan B
                LEFT JOIN Mahasiswa_TA M ON B.NPM = M.NPM
                LEFT JOIN Lokasi L ON B.idLokasi = L.idLokasi
                LEFT JOIN Bimbingan_Dosen BD ON B.idBimbingan = BD.idBimbingan
                WHERE BD.NIK = ?
                ORDER BY B.tanggal_Waktu_Bimbingan DESC;
            `;
        }

        // execute query nya ke db (pake prepared statement), terus nanti kalo udah beres di return si hasil apa aja yang didapetin
        // terus parameter dari execute itu, query dan si isi statement nya, jadi nanti setiap ? diisi pake array yang udah disiapin
        // (karena diatas ? nya cuma 1 ya makanya cuma [UserId] aja tapi sebenernya bs banyak), lebih jelas di uploadxlsx, itu manual
        const rows = await connection.execute(query, queryParams);
        // nah ini di return object paling pertama aja karena sisanya cuma metadata (belum butuh dipake)
        return rows[0];
    } finally {
        if (connection) connection.release();
    }
}

// ini function buat dapetin dosbing maneh siapa aja
export async function getDosen(npm) {
    let connection;
    try {
        const pool = await connectDB();
        connection = await pool.getConnection();
        // join mahasiswa dengan dosbing nya, trus diambil siapa aja dosbing nya
        const query = `
          SELECT D.NIK, D.nama_dosen, P.status_pembimbing
          FROM Plotting_Pembimbing P
          JOIN Dosen_Pembimbing D ON D.NIK = P.NIK
          WHERE NPM = ?
          ORDER BY P.status_pembimbing ASC
        `;
        const rows = await connection.execute(query, [npm]);
        return rows[0];
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

// cek jam jam yang udah keiisi, biar nanti di dropdown gada jadwal jadwal di jam segini (tergantung tanggal juga )
// dipanggil pas ganti tanggal atau klik pembimbing 2 ikut apa ngga
export async function getUnavailable(date, nik, npm) {
    let connection;
    try {
        const pool = await connectDB();
        connection = await pool.getConnection();

        // placeholder buat NIK semua dosen (jadi dari array query NIK dosen, nantinya dijadiin "?, ?, ?, ..." buat query)
        const dosenPlaceholders = nik.map(() => '?').join(',');

        // query buat cek tabel bimbingan, kalo udah ada bimbingan di jam tertentu gabisa diajuin lagi
        // sama juga klo dosen nya udh ada bimbingan dengan mahasiswa lain
        // konsep cek nya tuh, diliat si tabel Bimbingan_Dosen itu, diambil semua bimbingan yang melibatkan dosen dan mhs bersangkutan
        const queryBimbingan = `
          SELECT TIME_FORMAT(B.tanggal_Waktu_Bimbingan, '%H:00') as jamTerisi
          FROM Bimbingan B
          LEFT JOIN Bimbingan_Dosen BD ON B.idBimbingan = BD.idBimbingan
          WHERE DATE(B.tanggal_Waktu_Bimbingan) = ? AND B.status != 'Ditolak' 
          AND (BD.NIK IN (${dosenPlaceholders})) OR B.NPM = ?
        `;

        // parameter buat ngisi tanda tanya di query tadi, terus di execute aja, hasilnya ambil
        const paramsBimbingan = [date, ...nik, npm];
        console.log("DEBUG PARAMETER:");
        console.log("Date:", date);
        console.log("Dosen IDs:", nik);
        console.log("Student NPM:", npm);
        const rowsBimbingan = await connection.execute(queryBimbingan, paramsBimbingan);

        // disimpen pake set, biar gada data dobel nanti nya
        let bookedSet = new Set(rowsBimbingan[0].map(r => r.jamTerisi));

        // -----------------------------------------------------------------
        // Sekarang cek jadwal user juga, yang ada matkul matkul atau dosen sibuk
        // ubah dulu tanggal nya jadi hari, misal tgl nov 22 jadi hari sabtu
        const dateObj = new Date(date);
        const namaHari = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });

        // query buat cek jadwal dosen dan mhs
        const queryJadwal = `
            SELECT Jam_Mulai, Jam_Akhir 
            FROM Jadwal_User 
            WHERE Hari = ? 
            AND (
                NPM = ? OR                   -- Jadwal Kuliah Mahasiswa
                NIK IN (${dosenPlaceholders}) -- Jadwal Mengajar Dosen
            )
        `;

        // parameter buat ngisi ? di query
        const paramsJadwal = [namaHari, npm, ...nik];
        const rowsJadwal = await connection.execute(queryJadwal, paramsJadwal);

        // konversi range jam mulai - selesai jadi masing masing per jam, misal 8-10 jadi jam 8 (sampai sembilan) dan 9 (sampai sepuluh)
        for (const jadwal of rowsJadwal[0]) {
            // ambil jam mulai dan selesai, split dulu dari : nya, abis itu ambil si jam nya aj
            let start = parseInt(jadwal.Jam_Mulai.split(':')[0]);
            let end = parseInt(jadwal.Jam_Akhir.split(':')[0]);

            // loop jam jam nya, terus masukin ke set tadi
            for (var i = start; i < end; i++) {
                // format ulang (pake :)
                // padStart tuh... padStart(berapa panjangnya, kalo kurang didepannya tambahin pake ini), jadi nti hasilny semua kek format jam
                const jam = i.toString().padStart(2, '0') + ":00";
                bookedSet.add(jam);
            }
        }

        // return si set berisi jam jam yang sibuk dalam bentuk array
        return Array.from(bookedSet);
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

// method buat create pengajuan kalo klik submit
export async function createPengajuan(data) {
    let connection;
    try {
        // konek ke db kek sebelum nya
        const pool = await connectDB();
        connection = await pool.getConnection();

        // nah ini tuh baru, jadi misal disini kan ada beberapa query, ini tuh jadi semacam buffer buat hasil query
        // misal ada query yang gagal, maka query yang berhasil ga disimpen ke database (semisal ada bug di kode atau lainnya)
        await connection.beginTransaction();

        // Gabungkan Tanggal dan Jam menjadi DateTime string
        // data.tanggal = '2025-11-20', data.jam = '09:00' -> '2025-11-20 09:00:00'
        const dateTime = `${data.tanggal} ${data.jam}:00`;

        // A. Insert Bimbingan
        const queryInsert = `
          INSERT INTO Bimbingan (tanggal_Waktu_Bimbingan, catatan_Bimbingan, status, NPM, idLokasi)
          VALUES (?, '-', 'Menunggu', ?, ?)
        `;

        const res = await connection.execute(queryInsert, [dateTime, data.npm, data.lokasiId]);

        // ambil id bimbingan, karena autoincrement jadi bisa ambil dari InsertId
        const newId = res[0].insertId;

        // B. Insert Dosen Peserta, pake id bimbingan nya pake id yang udah diambil tadi
        for (const nik of data.nik) {
            await connection.execute(
                `INSERT INTO Bimbingan_Dosen (idBimbingan, NIK) VALUES (?, ?)`,
                [newId, nik]
            );
        }

        // nah ini commit baru masukin data data tadi ke db
        await connection.commit();
        return true;
    } catch (err) {
        // kalo ada gagal nah baru rollback
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

export async function getLokasi() {
    let connection;
    try {
        const pool = await connectDB();
        connection = await pool.getConnection();

        // Query simpel: Ambil ID dan Nama Ruangan
        // [rows] itu pake array deconstructing, sama aja kek rows[0] da
        const [rows] = await connection.execute('SELECT idLokasi, namaRuangan FROM Lokasi');

        return rows; // Kembalikan array lokasi
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.release();
    }
}