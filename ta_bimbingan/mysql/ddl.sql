-- 1. Reset Database
DROP DATABASE IF EXISTS ta_bimbingan;
CREATE DATABASE ta_bimbingan;
USE ta_bimbingan;

-- ==========================================
-- BAGIAN 1: TABEL PENGGUNA (USER)
-- ==========================================

CREATE TABLE users (
	id_users VARCHAR(20) PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL
);

-- 4. Tabel Mahasiswa TA (Sesuai ERD - Atribut Lengkap)
CREATE TABLE data_ta (
    id_data INT PRIMARY KEY AUTO_INCREMENT,
    id_users VARCHAR(20) NOT NULL,
    
	CONSTRAINT fk_user FOREIGN KEY (id_users) REFERENCES users(id_users) ON DELETE CASCADE,

    -- Atribut Khusus dari ERD
    semester INT,
    topik VARCHAR(250),     -- Judul/Topik TA
	jenis_ta INT NOT NULL, 	-- sia ambil ta brp
    status_eligible BOOLEAN DEFAULT FALSE -- Apakah boleh sidang/bimbingan
);

-- ==========================================
-- BAGIAN 2: TABEL PENDUKUNG (MASTER DATA)
-- ==========================================

-- 5. Tabel lokasi (Sesuai ERD)
CREATE TABLE lokasi (
    id_lokasi INT PRIMARY KEY AUTO_INCREMENT,
    nama_ruangan VARCHAR(50) NOT NULL
);

-- 6. Tabel Rentang Semester (Sesuai ERD)
-- Dikelola oleh Admin
CREATE TABLE rentang_semester (
    id_semester INT PRIMARY KEY AUTO_INCREMENT,
    nama_semester VARCHAR(50), -- Contoh: "Ganjil 2024/2025"
    tanggal_awal_semester DATE,
    tanggal_UTS_selesai DATE,
    tanggal_UAS_selesai DATE
);

-- Tabel Plotting (Menentukan Siapa Pembimbing Tetap Mahasiswa)
CREATE TABLE plotting_pembimbing (
    id_plotting INT PRIMARY KEY AUTO_INCREMENT,
    
    npm VARCHAR(20) NOT NULL, -- Siapa mhs nya
	nik VARCHAR(20) NOT NULL, -- Siapa dosen nya

    status_pembimbing INT NOT NULL, -- 1 'Pembimbing 1' atau 2 'Pembimbing 2'
    
    CONSTRAINT FK_Plotting_Mhs FOREIGN KEY (npm) REFERENCES users(id_users) ON DELETE CASCADE,
	CONSTRAINT FK_Plotting_Dosen FOREIGN KEY (nik) REFERENCES users(id_users) ON DELETE CASCADE
);

-- ==========================================
-- BAGIAN 3: TABEL TRANSAKSI & RELASI
-- ==========================================

-- 7. Tabel bimbingan (Sesuai ERD)
-- Menghubungkan Mahasiswa, Dosen, dan lokasi
CREATE TABLE bimbingan (
    id_bimbingan INT PRIMARY KEY AUTO_INCREMENT,
    id_data INT NOT NULL, -- kolom buat konekin ke data punya siapa
    
    id_lokasi INT NULL, -- bimbingannya dimana
    tanggal DATE NOT NULL,	
    waktu TIME NOT NULL,
    catatan_bimbingan TEXT, -- Notes dari dosen / Topik pengajuan
	status ENUM('Menunggu','Disetujui','Selesai','Ditolak') DEFAULT 'Menunggu',
    
    CONSTRAINT FK_bimbingan_Mhs FOREIGN KEY (id_data) REFERENCES data_ta(id_data) ON DELETE CASCADE,
    CONSTRAINT FK_bimbingan_lokasi FOREIGN KEY (id_lokasi) REFERENCES lokasi(id_lokasi) ON DELETE SET NULL
);

-- B. Buat Tabel Baru: Peserta Dosen bimbingan, sebuah bimbingan bisa dihadiri 2 orang dosbing
CREATE TABLE bimbingan_dosen (
    id_bimbingan INT,
    
    nik VARCHAR(20),
    
    PRIMARY KEY (id_bimbingan, nik), -- Kombinasi unik
    status ENUM('Menunggu','Disetujui','Selesai','Ditolak') DEFAULT 'Menunggu',
    
    CONSTRAINT FK_BD_bimbingan FOREIGN KEY (id_bimbingan) REFERENCES bimbingan(id_bimbingan) ON DELETE CASCADE,
    CONSTRAINT FK_BD_Dosen FOREIGN KEY (nik) REFERENCES users(id_users) ON DELETE CASCADE
);

-- 8. Tabel notifikasi (Sesuai ERD)
-- ERD menghubungkan notifikasi ke Mahasiswa (has).
-- Tapi secara logika SRS, Dosen juga butuh notif, jadi kita buat nullable FK dua-duanya.
CREATE TABLE notifikasi (
    id_notif INT PRIMARY KEY AUTO_INCREMENT,
    isi TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE, -- buat di UI, kalo misal blm di liat ada highlight ato smth
    tanggal_waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Relasi Owner notifikasi (FK)
    id_users VARCHAR(20),
    
    CONSTRAINT FK_Notif_Mhs FOREIGN KEY (id_users) REFERENCES users(id_users) ON DELETE CASCADE
);

-- 9. Tabel Jadwal User (Sesuai ERD)
-- Ini untuk jadwal ketersediaan/kuliah Mahasiswa DAN Dosen
CREATE TABLE jadwal_user (
	id_jadwal INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Data Jadwalnya
    hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'), -- Senin, Selasa, dll
    jam_mulai TIME,
    jam_akhir TIME,
    
    -- RELASI "BERTIGA" (Mahasiswa, Dosen, Jadwal)
    -- Kita pasang dua kolom ID, tapi boleh NULL (kosong)
    id_users VARCHAR(20) NOT NULL, 
    
    -- Foreign Keys (Menghubungkan ke tabel induk)
    CONSTRAINT FK_Jadwal_Mhs FOREIGN KEY (id_users) REFERENCES users(id_users) ON DELETE CASCADE
);

-- log buat admin
CREATE TABLE log_aktivitas (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_users VARCHAR(20) NULL,
    aksi VARCHAR(100) NOT NULL,      -- Jenis aksi (CREATE_JADWAL, LOGIN, AJUKAN_bimbingan)
    waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_users) REFERENCES users(id_users) ON DELETE SET NULL
);
