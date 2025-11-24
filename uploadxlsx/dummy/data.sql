CREATE DATABASE ta_bimbingan;

CREATE TABLE jadwal_user (
    id_jadwal INT AUTO_INCREMENT PRIMARY KEY,
    jam_mulai TIME NOT NULL,
    jam_akhir TIME NOT NULL,
    hari VARCHAR(20) NOT NULL
);