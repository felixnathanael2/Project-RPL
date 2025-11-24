import { connectDB } from "../db.js";

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
      query = `SELECT B.tanggal_Waktu_Bimbingan AS tanggal, B.catatan_Bimbingan AS catatan, D.nama_Dosen, L.namaRuangan FROM Bimbingan B INNER JOIN Dosen_Pembimbing D ON B.NIK = D.NIK INNER JOIN Lokasi L ON B.idLokasi = L.idLokasi WHERE B.NPM = ? AND B.status = 'Selesai' ORDER BY B.tanggal_Waktu_Bimbingan DESC;`;
    } else if (role === "Dosen") {
      // ... Query SELECT Dosen JOIN Mahasiswa dan Lokasi ...
      query = `SELECT B.tanggal_Waktu_Bimbingan AS tanggal, B.catatan_Bimbingan AS catatan, M.namaMahasiswa, L.namaRuangan FROM Bimbingan B INNER JOIN Mahasiswa_TA M ON B.NPM = M.NPM INNER JOIN Lokasi L ON B.idLokasi = L.idLokasi WHERE B.NIK = ? AND B.status = 'Selesai' ORDER BY B.tanggal_Waktu_Bimbingan DESC;`;
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
