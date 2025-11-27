import { connectDB } from "../db/db.js";

export async function getRiwayatBimbingan(userId, role) {
    const pool = await connectDB();

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
    const rows = await pool.execute(query, queryParams);
    // nah ini di return object paling pertama aja karena sisanya cuma metadata (belum butuh dipake)
    return rows[0];
}

export async function createPengajuan(data) {
    let connection;
    try {
        // konek ke db kek sebelum nya
        const pool = await connectDB();
        connection = await pool.getConnection();

        // nah ini tuh baru, jadi misal disini kan ada beberapa query, ini tuh jadi semacam buffer buat hasil query
        // misal ada query yang gagal, maka query yang berhasil ga disimpen ke database (semisal ada bug di kode atau lainnya)
        await connection.beginTransaction();

        const queryDataTA = "SELECT id_data FROM data_ta WHERE id_users = ?";

        const [id_data] = await connection.execute(queryDataTA, [data.npm]);

        // A. Insert Bimbingan
        const queryInsert = `
          INSERT INTO bimbingan (id_data, id_lokasi, tanggal, waktu, catatan_bimbingan, status)
          VALUES (?, ?, ?, ?, '-', 'Menunggu')
        `;

        const res = await connection.execute(queryInsert, [
            id_data[0].id_data,
            data.lokasiId,
            data.tanggal,
            data.waktu,
        ]);

        // ambil id bimbingan, karena autoincrement jadi bisa ambil dari InsertId
        const newId = res[0].insertId;

        // B. Insert Dosen Peserta, pake id bimbingan nya pake id yang udah diambil tadi
        for (const nik of data.nik) {
            await connection.execute(
                `INSERT INTO Bimbingan_Dosen (id_bimbingan, nik) VALUES (?, ?)`,
                [newId, nik],
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
