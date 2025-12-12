DROP DATABASE IF EXISTS ta_bimbingan;
CREATE DATABASE ta_bimbingan;
USE ta_bimbingan;

CREATE TABLE users (
    id_users VARCHAR(20) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL
);

CREATE TABLE rentang_semester (
    id_semester INT PRIMARY KEY AUTO_INCREMENT,
    nama_semester VARCHAR(50),
    tanggal_awal_semester DATE,
    tanggal_UTS_selesai DATE,
    tanggal_UAS_selesai DATE
);

CREATE TABLE data_ta (
    id_data INT PRIMARY KEY AUTO_INCREMENT,
    id_users VARCHAR(20) NOT NULL,
    semester INT,
    topik VARCHAR(250),
    jenis_ta INT NOT NULL,
    status_eligible BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (id_users)
        REFERENCES users(id_users) ON DELETE CASCADE,
    CONSTRAINT fk_semester FOREIGN KEY (semester)
        REFERENCES rentang_semester(id_semester) ON DELETE CASCADE
);

CREATE TABLE lokasi (
    id_lokasi INT PRIMARY KEY AUTO_INCREMENT,
    nama_ruangan VARCHAR(50) NOT NULL
);

CREATE TABLE plotting_pembimbing (
    id_plotting INT PRIMARY KEY AUTO_INCREMENT,
    npm VARCHAR(20) NOT NULL,
    nik VARCHAR(20) NOT NULL,
    status_pembimbing INT NOT NULL,
    CONSTRAINT FK_Plotting_Mhs FOREIGN KEY (npm)
        REFERENCES users(id_users) ON DELETE CASCADE,
    CONSTRAINT FK_Plotting_Dosen FOREIGN KEY (nik)
        REFERENCES users(id_users) ON DELETE CASCADE
);

CREATE TABLE bimbingan (
    id_bimbingan INT PRIMARY KEY AUTO_INCREMENT,
    id_data INT NOT NULL,
    id_lokasi INT NULL,
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    catatan_bimbingan TEXT,
    status ENUM('Menunggu','Disetujui','Selesai','Ditolak') DEFAULT 'Menunggu',
    CONSTRAINT FK_bimbingan_Mhs FOREIGN KEY (id_data)
        REFERENCES data_ta(id_data) ON DELETE CASCADE,
    CONSTRAINT FK_bimbingan_lokasi FOREIGN KEY (id_lokasi)
        REFERENCES lokasi(id_lokasi) ON DELETE SET NULL
);

CREATE TABLE bimbingan_dosen (
    id_bimbingan INT,
    nik VARCHAR(20),
    status ENUM('Menunggu','Disetujui','Selesai','Ditolak') DEFAULT 'Menunggu',
    PRIMARY KEY (id_bimbingan, nik),
    CONSTRAINT FK_BD_bimbingan FOREIGN KEY (id_bimbingan)
        REFERENCES bimbingan(id_bimbingan) ON DELETE CASCADE,
    CONSTRAINT FK_BD_Dosen FOREIGN KEY (nik)
        REFERENCES users(id_users) ON DELETE CASCADE
);

CREATE TABLE notifikasi (
    id_notif INT PRIMARY KEY AUTO_INCREMENT,
    isi TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    tanggal_waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_users VARCHAR(20),
    CONSTRAINT FK_Notif_User FOREIGN KEY (id_users)
        REFERENCES users(id_users) ON DELETE CASCADE
);

CREATE TABLE jadwal_user (
    id_jadwal INT PRIMARY KEY AUTO_INCREMENT,
    hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'),
    jam_mulai TIME,
    jam_akhir TIME,
    id_users VARCHAR(20) NOT NULL,
    CONSTRAINT FK_Jadwal_User FOREIGN KEY (id_users)
        REFERENCES users(id_users) ON DELETE CASCADE
);

CREATE TABLE log_aktivitas (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_users VARCHAR(20),
    aksi VARCHAR(100) NOT NULL,
    waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_users)
        REFERENCES users(id_users) ON DELETE SET NULL
);

CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);