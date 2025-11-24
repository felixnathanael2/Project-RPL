-- 1. Reset Database
DROP DATABASE IF EXISTS ta_bimbingan;
CREATE DATABASE ta_bimbingan;
USE ta_bimbingan;

-- ==========================================
-- BAGIAN 1: TABEL PENGGUNA (USER)
-- ==========================================

-- 2. Tabel Admin (Sesuai ERD)
CREATE TABLE Admin (
    idAdmin INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 3. Tabel Dosen Pembimbing (Sesuai ERD)
CREATE TABLE Dosen_Pembimbing (
    NIK VARCHAR(20) PRIMARY KEY,
    nama_Dosen VARCHAR(100) NOT NULL,
    email_Dosen VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 4. Tabel Mahasiswa TA (Sesuai ERD - Atribut Lengkap)
CREATE TABLE Mahasiswa_TA (
    NPM VARCHAR(20) PRIMARY KEY,
    nama_Mahasiswa VARCHAR(100) NOT NULL,
    email_Mahasiswa VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    -- Atribut Khusus dari ERD
    angkatan INT,
    Topik TEXT,                -- Judul/Topik TA
    TA1 BOOLEAN DEFAULT FALSE, -- Status ambil TA1
    TA2 BOOLEAN DEFAULT FALSE, -- Status ambil TA2
    status_Eligible BOOLEAN DEFAULT TRUE -- Apakah boleh sidang/bimbingan
);

-- ==========================================
-- BAGIAN 2: TABEL PENDUKUNG (MASTER DATA)
-- ==========================================

-- 5. Tabel Lokasi (Sesuai ERD)
CREATE TABLE Lokasi (
    idLokasi INT PRIMARY KEY AUTO_INCREMENT,
    namaRuangan VARCHAR(50) NOT NULL,
    statusRuangan VARCHAR(20) DEFAULT 'Tersedia' -- Tersedia / Penuh / Maintenance
);

-- 6. Tabel Rentang Semester (Sesuai ERD)
-- Dikelola oleh Admin
CREATE TABLE Rentang_Semester (
    idSemester INT PRIMARY KEY AUTO_INCREMENT,
    namaSemester VARCHAR(50), -- Contoh: "Ganjil 2024/2025"
    tanggalAwalSemester DATE,
    tanggalUTSSelesai DATE,
    tanggalUASSelesai DATE
);

-- Tabel Plotting (Menentukan Siapa Pembimbing Tetap Mahasiswa)
CREATE TABLE Plotting_Pembimbing (
    idPlotting INT PRIMARY KEY AUTO_INCREMENT,
    
    NPM VARCHAR(20) NOT NULL, -- Siapa Mahasiswanya
    NIK VARCHAR(20) NOT NULL, -- Siapa Dosennya
    
    status_pembimbing VARCHAR(20) NOT NULL, -- 'Pembimbing 1' atau 'Pembimbing 2'
    
    -- Mencegah Data Ganda
    UNIQUE(NPM, NIK),
    
    CONSTRAINT FK_Plotting_Mhs FOREIGN KEY (NPM) REFERENCES Mahasiswa_TA(NPM) ON DELETE CASCADE,
    CONSTRAINT FK_Plotting_Dosen FOREIGN KEY (NIK) REFERENCES Dosen_Pembimbing(NIK) ON DELETE CASCADE
);

-- ==========================================
-- BAGIAN 3: TABEL TRANSAKSI & RELASI
-- ==========================================

-- 7. Tabel Bimbingan (Sesuai ERD)
-- Menghubungkan Mahasiswa, Dosen, dan Lokasi
CREATE TABLE Bimbingan (
    idBimbingan INT PRIMARY KEY AUTO_INCREMENT,
    tanggal_Waktu_Bimbingan DATETIME NOT NULL,
    catatan_Bimbingan TEXT, -- Notes dari dosen / Topik pengajuan
    status VARCHAR(20) DEFAULT 'Menunggu', -- Menunggu, Disetujui, Selesai, Ditolak
    
    -- Foreign Keys
    NPM VARCHAR(20) NOT NULL,
    idLokasi INT,
    
    CONSTRAINT FK_Bimbingan_Mhs FOREIGN KEY (NPM) REFERENCES Mahasiswa_TA(NPM) ON DELETE CASCADE,
    CONSTRAINT FK_Bimbingan_Lokasi FOREIGN KEY (idLokasi) REFERENCES Lokasi(idLokasi) ON DELETE SET NULL
);

-- B. Buat Tabel Baru: Peserta Dosen Bimbingan, sebuah bimbingan bisa dihadiri 2 orang dosbing
CREATE TABLE Bimbingan_Dosen (
    idBimbingan INT,
    NIK VARCHAR(20),
    
    PRIMARY KEY (idBimbingan, NIK), -- Kombinasi unik
    
    CONSTRAINT FK_BD_Bimbingan FOREIGN KEY (idBimbingan) REFERENCES Bimbingan(idBimbingan) ON DELETE CASCADE,
    CONSTRAINT FK_BD_Dosen FOREIGN KEY (NIK) REFERENCES Dosen_Pembimbing(NIK) ON DELETE CASCADE
);

-- 8. Tabel Notifikasi (Sesuai ERD)
-- ERD menghubungkan Notifikasi ke Mahasiswa (has).
-- Tapi secara logika SRS, Dosen juga butuh notif, jadi kita buat nullable FK dua-duanya.
CREATE TABLE Notifikasi (
    idNotif INT PRIMARY KEY AUTO_INCREMENT,
    isi TEXT NOT NULL,
    tanggal_Waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Relasi Owner Notifikasi (FK)
    NPM VARCHAR(20),
    NIK VARCHAR(20),
    
    CONSTRAINT FK_Notif_Mhs FOREIGN KEY (NPM) REFERENCES Mahasiswa_TA(NPM) ON DELETE CASCADE,
    CONSTRAINT FK_Notif_Dosen FOREIGN KEY (NIK) REFERENCES Dosen_Pembimbing(NIK) ON DELETE CASCADE
);

-- 9. Tabel Jadwal User (Sesuai ERD)
-- Ini untuk jadwal ketersediaan/kuliah Mahasiswa DAN Dosen
CREATE TABLE Jadwal_User (
idJadwal INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Data Jadwalnya
    Hari VARCHAR(10), -- Senin, Selasa, dll
    Jam_Mulai TIME,
    Jam_Akhir TIME,
    -- Keterangan VARCHAR(50), -- Misal: "Kuliah PBO" atau "Rapat Prodi" (optional)
    
    -- RELASI "BERTIGA" (Mahasiswa, Dosen, Jadwal)
    -- Kita pasang dua kolom ID, tapi boleh NULL (kosong)
    NPM VARCHAR(20) NULL, 
    NIK VARCHAR(20) NULL,
    
    -- Foreign Keys (Menghubungkan ke tabel induk)
    CONSTRAINT FK_Jadwal_Mhs FOREIGN KEY (NPM) REFERENCES Mahasiswa_TA(NPM) ON DELETE CASCADE,
    CONSTRAINT FK_Jadwal_Dosen FOREIGN KEY (NIK) REFERENCES Dosen_Pembimbing(NIK) ON DELETE CASCADE,
    
    -- Validasi (Opsional tapi bagus): 
    -- Pastikan dalam satu baris, tidak boleh dua-duanya kosong
    -- (Harus punya salah satu)
    CONSTRAINT Cek_Pemilik CHECK (NPM IS NOT NULL OR NIK IS NOT NULL)
);
