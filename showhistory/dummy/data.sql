-- 1. Reset & Buat Database Baru (skip karena udh ada)
SELECT * FROM Mahasiswa_TA;
-- 2. Tabel Dosen Pembimbing
-- (Kita tambah kolom password untuk keperluan Login)
CREATE TABLE Dosen_Pembimbing (
    NIK VARCHAR(20) PRIMARY KEY,
    nama_Dosen VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL -- Password disimpan text biasa dulu
);

-- 3. Tabel Mahasiswa TA
-- (Kita tambah kolom password untuk keperluan Login)
CREATE TABLE Mahasiswa_TA (
    NPM VARCHAR(20) PRIMARY KEY,
    namaMahasiswa VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL -- Password disimpan text biasa dulu
);

-- 4. Tabel Lokasi
-- (Diperlukan karena tabel Bimbingan merujuk ke sini)
CREATE TABLE Lokasi (
    idLokasi INT PRIMARY KEY AUTO_INCREMENT,
    namaRuangan VARCHAR(50) NOT NULL
);

-- 5. Tabel Bimbingan
-- (Tabel Inti untuk fitur Riwayat)
CREATE TABLE Bimbingan (
    idBimbingan INT PRIMARY KEY AUTO_INCREMENT,
    tanggal_Waktu_Bimbingan DATETIME NOT NULL,
    catatan_Bimbingan TEXT, -- Berisi topik/inti pembahasan
    status VARCHAR(20) DEFAULT 'Menunggu', -- Menunggu, Disetujui, Selesai, Ditolak
    
    -- Foreign Keys
    NPM VARCHAR(20) NOT NULL,
    NIK VARCHAR(20) NOT NULL,
    idLokasi INT,
    
    CONSTRAINT FK_Mhs FOREIGN KEY (NPM) REFERENCES Mahasiswa_TA(NPM),
    CONSTRAINT FK_Dosen FOREIGN KEY (NIK) REFERENCES Dosen_Pembimbing(NIK),
    CONSTRAINT FK_Lokasi FOREIGN KEY (idLokasi) REFERENCES Lokasi(idLokasi)
);

-- ==========================================
-- SEEDING DATA (DATA CONTOH UNTUK TESTING)
-- ==========================================

-- A. Masukkan Data Dosen (Password: password123)
INSERT INTO Dosen_Pembimbing (NIK, nama_Dosen, email, password) 
VALUES ('10001', 'Dr. Budi Santoso, M.T.', 'budi@univ.ac.id', 'password123');

-- B. Masukkan Data Mahasiswa (Password: password123)
INSERT INTO Mahasiswa_TA (NPM, namaMahasiswa, email, password) 
VALUES ('6182301015', 'Axel Jeremy', 'axel@student.univ.ac.id', 'password123');

-- C. Masukkan Data Lokasi
INSERT INTO Lokasi (namaRuangan) VALUES 
('Ruang 101 (Gedung A)'),
('Lab Komputer Dasar'),
('Online (Zoom)');

-- D. Masukkan Data Riwayat Bimbingan
-- Penting: Status harus 'Selesai' agar muncul di query riwayat kita tadi

-- Riwayat 1 (Sudah Selesai - Akan Muncul)
INSERT INTO Bimbingan (tanggal_Waktu_Bimbingan, catatan_Bimbingan, status, NPM, NIK, idLokasi) 
VALUES 
('2025-11-01 10:00:00', 'Pembahasan Bab 1: Latar Belakang Masalah', 'Selesai', '6182301015', '10001', 1);

-- Riwayat 2 (Sudah Selesai - Akan Muncul)
INSERT INTO Bimbingan (tanggal_Waktu_Bimbingan, catatan_Bimbingan, status, NPM, NIK, idLokasi) 
VALUES 
('2025-11-15 14:30:00', 'Revisi Bab 1 dan Lanjut Bab 2 Landasan Teori', 'Selesai', '6182301015', '10001', 3);

-- Riwayat 3 (Masih Menunggu - TIDAK AKAN MUNCUL di Riwayat)
-- Ini buat ngetes filter WHERE status = 'Selesai' berfungsi atau enggak
INSERT INTO Bimbingan (tanggal_Waktu_Bimbingan, catatan_Bimbingan, status, NPM, NIK, idLokasi) 
VALUES 
('2025-12-01 09:00:00', 'Rencana Pembahasan Bab 3 Metodologi', 'Menunggu', '6182301015', '10001', 1);