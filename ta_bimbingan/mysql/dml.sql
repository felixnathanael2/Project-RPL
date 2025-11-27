-- ==========================================
-- USERS
-- ==========================================
INSERT INTO users (id_users, email, nama, password, role) VALUES
('kaprodi', 'kaprodi@unpar.ac.id', 'Lord Kaprodi', 'admin123', 3),
(20250001, 'davin@unpar.ac.id', 'Davin Senat', 'pass123', 2),
(6182301055, '6182301055@student.unpar.ac.id', 'Gregorius Jason Maresi', 'pass123', 1);

-- ==========================================
-- DATA TA
-- ==========================================
INSERT INTO data_ta (id_users, semester, Topik, jenis_ta, status_eligible)
VALUES
('6182301055', 5, 'Sistem Penjadwalan Bimbingan TA berbasis Web', 1, TRUE),
('6182301055', 6, 'Analisis Performa YOLO pada Deteksi Objek', 2, FALSE);

-- ==========================================
-- LOKASI
-- ==========================================
INSERT INTO lokasi (nama_ruangan) VALUES
('Lab TA'),
('9015'),
('9016'),
('9017'),
('9018');

-- ==========================================
-- RENTANG SEMESTER
-- ==========================================
INSERT INTO rentang_semester (nama_semester, tanggal_awal_semester, tanggal_UTS_selesai, tanggal_UAS_selesai) VALUES
('Ganjil 2024/2025', '2024-08-01', '2024-10-15', '2024-12-20');

-- ==========================================
-- PLOTTING PEMBIMBING
-- ==========================================
INSERT INTO plotting_pembimbing (npm, nik, status_pembimbing) VALUES
('6182301055', '20250001', 1);

-- ==========================================
-- JADWAL USER
-- ==========================================
INSERT INTO jadwal_user (Hari, Jam_mulai, Jam_akhir, id_users) VALUES
('Senin',  '08:00', '10:00', '20250001'),
('Rabu',   '13:00', '15:00', '20250001'),

('Selasa', '09:00', '11:00', '6182301055'),
('Kamis',  '10:00', '12:00', '6182301055');

-- ==========================================
-- BIMBINGAN
-- ==========================================
INSERT INTO bimbingan (id_data, id_lokasi, tanggal, waktu, catatan_bimbingan, status)
VALUES
(1, 1, '2025-01-10', '09:00:00', 'Diskusi awal terkait judul & scope.', 'Disetujui'),
(1, 2, '2025-01-20', '13:00:00', 'Review BAB 1 dan 2.', 'Selesai'),
(1, NULL, '2025-02-05', '10:30:00', 'Pengajuan jadwal online.', 'Menunggu');


-- ==========================================
-- BIMBINGAN DOSEN
-- ==========================================
INSERT INTO bimbingan_dosen (id_bimbingan, nik) VALUES
(1, '20250001');

-- ==========================================
-- NOTIFIKASI
-- ==========================================
INSERT INTO notifikasi (isi, id_users, is_read)
VALUES
('Pengajuan bimbingan Anda sedang diproses.', '6182301055', FALSE),
('Mahasiswa mengajukan bimbingan baru.', '20250001', FALSE),
('Jadwal bimbingan telah disetujui.', '6182301055', TRUE);


-- ==========================================
-- LOG AKTIVITAS
-- ==========================================
INSERT INTO log_aktivitas (id_users, aksi) VALUES
(6182301055, 'AJUKAN_BIMBINGAN'),
(20250001, 'SETUJUI_BIMBINGAN'),
('kaprodi', 'LOGIN');
