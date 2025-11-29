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
INSERT INTO jadwal_user (Hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '08:00', '10:00', '20250001'),
('Rabu',   '13:00', '15:00', '20250001'),

('Selasa', '09:00', '11:00', '6182301055'),
('Kamis',  '10:00', '12:00', '6182301055');

-- ==========================================
-- BIMBINGAN
-- ==========================================
INSERT INTO bimbingan (id_data, id_lokasi, tanggal, waktu, catatan_bimbingan, status)
VALUES
(1, 1, '2025-11-29', '09:00:00', 'Diskusi awal terkait judul & scope.', 'Disetujui'),
-- (1, 1, '2025-11-28', '10:00:00', 'Diskusi awal terkait judul & scope.', 'Disetujui'),
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


SELECT 
            b.tanggal, 
            b.waktu, 
            -- Menggabungkan nama dosen jika ada 2 pembimbing
            GROUP_CONCAT(u.nama SEPARATOR ', ') as nama_dosen
        FROM bimbingan b
        JOIN data_ta dt ON b.id_data = dt.id_data
        JOIN bimbingan_dosen bd ON b.id_bimbingan = bd.id_bimbingan
        JOIN users u ON bd.nik = u.id_users
        WHERE 
            dt.id_users = 6182301055
            AND b.status = 'Disetujui'
        GROUP BY b.id_bimbingan;
        
        
-- ==========================================
-- 1. TAMBAH BIMBINGAN (Status 'Disetujui')
-- ==========================================
-- Kita hardcode ID Bimbingan mulai dari 100 biar aman (gak bentrok sama data lama)
-- Asumsi: id_data = 1 adalah milik mahasiswa '6182301055'

INSERT INTO bimbingan (id_bimbingan, id_data, id_lokasi, tanggal, waktu, catatan_bimbingan, status) VALUES
-- Bulan Maret (Masa Lalu)
(100, 1, 1, '2025-03-24', '09:00:00', 'Revisi Bab 1: Latar Belakang', 'Disetujui'),
(101, 1, 1, '2025-03-31', '10:00:00', 'Revisi Bab 1: Rumusan Masalah', 'Disetujui'),

-- Bulan April (Fokus Kalender Dashboard)
(102, 1, 2, '2025-04-07', '09:00:00', 'Bimbingan Bab 2: Landasan Teori', 'Disetujui'),
(103, 1, 2, '2025-04-14', '13:00:00', 'Revisi Bab 2: Studi Literatur', 'Disetujui'),
(104, 1, 1, '2025-04-21', '10:30:00', 'Bimbingan Bab 3: Metodologi', 'Disetujui'),
(105, 1, 3, '2025-04-28', '14:00:00', 'Finalisasi Bab 1-3 untuk Sempro', 'Disetujui'),

-- Data 'Menunggu' & 'Ditolak' (Buat ngetes filter: Harusnya TIDAK MUNCUL di query)
(106, 1, 1, '2025-04-15', '08:00:00', 'Pengajuan dadakan', 'Ditolak'),
(107, 1, 1, '2025-04-22', '09:00:00', 'Pengajuan baru', 'Menunggu'),

-- Bulan Mei (Masa Depan)
(108, 1, 1, '2025-05-05', '09:00:00', 'Persiapan Seminar Proposal', 'Disetujui');

-- ==========================================
-- 2. HUBUNGKAN KE DOSEN (Davin Senat)
-- ==========================================
-- Menghubungkan bimbingan di atas dengan NIK '20250001'

INSERT INTO bimbingan_dosen (id_bimbingan, nik) VALUES
(100, '20250001'),
(101, '20250001'),
(102, '20250001'),
(103, '20250001'),
(104, '20250001'),
(105, '20250001'),
(106, '20250001'), -- Tetap ada relasinya meski ditolak
(107, '20250001'),
(108, '20250001');

SELECT * FROM lokasi