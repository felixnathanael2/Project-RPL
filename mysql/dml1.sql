INSERT INTO users (id_users, email, nama, password, role) VALUES
('kaprodi', 'kaprodi@unpar.ac.id', 'Lord Kaprodi', 'admin123', 3),
('20250001', 'davin@unpar.ac.id', 'Davin Senat', 'pass123', 2),
('20250002', 'kingnan@unpar.ac.id', 'Kingnan', 'pass123', 2),
('20250003', 'vonoil@unpar.ac.id', 'vonoil', 'pass123', 2),
('20250004', 'remon@unpar.ac.id', 'remon', 'pass123', 2),
('6182301055', '6182301055@student.unpar.ac.id', 'Gregorius Jason Maresi', 'pass123', 1),
('6182301015', '6182301015@student.unpar.ac.id', 'Davin Mahasiswa', 'pass123', 1),
('6182301019', '6182301019@student.unpar.ac.id', 'Pilip Purnama', 'pass123', 1),
('6182301099', '6182301099@student.unpar.ac.id', 'MCGG TROSSS', 'pass123', 1),
('6182301054', '6182301054@student.unpar.ac.id', 'Pelik Natan', 'pass123', 1),
('6182301058', '6182301058@student.unpar.ac.id', 'Sella', 'pass123', 1),
('6182301017', '6182301017@student.unpar.ac.id', 'Adam', 'pass123', 1),
('6182301010', '6182301010@student.unpar.ac.id', 'Endru Sepuh', 'pass123', 1),
('6182301040', '6182301040@student.unpar.ac.id', 'Eban', 'pass123', 1),
('6182301005', '6182301005@student.unpar.ac.id', 'Arik', 'pass123', 1),
('6182301002', '6182301002@student.unpar.ac.id', 'foofoofaafaa', 'pass123', 1);

INSERT INTO lokasi (nama_ruangan) VALUES
('ESBE'),
('Ekara'),
('PVJ'),
('Boromeus'),
('Rumah'),
('Lab TA'),
('9013'),
('9015'),
('9016'),
('9017'),
('9018');

INSERT INTO rentang_semester (id_semester, nama_semester, tanggal_awal_semester, tanggal_UTS_selesai, tanggal_UAS_selesai) VALUES
(59, 'Ganjil 2025/2026', '2025-09-01', '2025-10-30', '2026-01-20');

INSERT INTO data_ta (id_users, semester, topik, jenis_ta, status_eligible) VALUES
('6182301055', 59, 'Sistem AI Canggih', 1, FALSE),     -- Gregorius

('6182301015', 59, 'Sistem Informasi Keuangan', 1, FALSE), -- Davin TA 1
('6182301015', 59, 'Machine Learning Lanjut', 2, FALSE),   -- Davin TA 2 (ambil 2 sekaligus)

('6182301019', 59, 'Analisis Big Data Kesehatan', 1, FALSE),
('6182301099', 59, 'Optimasi Sistem Logistik', 1, FALSE),
('6182301054', 59, 'Deep Learning Vision', 1, FALSE),
('6182301058', 59, 'Game Engine Optimization', 1, FALSE),
('6182301017', 59, 'Neural Interface Design', 1, FALSE),
('6182301010', 59, 'Security Penetration Testing', 1, FALSE),
('6182301040', 59, 'IoT Environmental Monitoring', 1, FALSE),
('6182301005', 59, 'Cloud Computing Scheduler', 1, FALSE),
('6182301002', 59, 'Data Mining Retail', 1, FALSE);

INSERT INTO plotting_pembimbing (npm, nik, status_pembimbing) VALUES
-- Gregorius dengan 2 dosbing
('6182301055', '20250001', 1),
('6182301055', '20250002', 2),

-- Davin
('6182301015', '20250001', 1),

-- Lain-lain
('6182301019', '20250003', 1),
('6182301099', '20250002', 1),
('6182301054', '20250004', 1),
('6182301058', '20250003', 1),
('6182301017', '20250001', 1),
('6182301010', '20250002', 1),
('6182301040', '20250004', 1),
('6182301005', '20250003', 1),
('6182301002', '20250001', 1);

-- Jadwal dosen 20250001
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '08:00', '10:00', '20250001'),
('Rabu',   '13:00', '15:00', '20250001'),
('Jumat',  '09:00', '11:00', '20250001');

-- Jadwal dosen 20250002
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '09:00', '11:00', '20250002'),
('Kamis',  '10:00', '12:00', '20250002'),
('Jumat',  '13:00', '15:00', '20250002');

-- Jadwal dosen 20250003
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '10:00', '12:00', '20250003'),
('Rabu',   '08:00', '10:00', '20250003'),
('Kamis',  '14:00', '16:00', '20250003');

-- Jadwal dosen 20250004
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '13:00', '15:00', '20250004'),
('Kamis',  '08:00', '10:00', '20250004'),
('Jumat',  '10:00', '12:00', '20250004');

-- 6182301055
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '07:00', '09:00', '6182301055'),
('Rabu',   '10:00', '12:00', '6182301055'),
('Jumat',  '13:00', '15:00', '6182301055');

-- 6182301015
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '08:00', '10:00', '6182301015'),
('Kamis',  '13:00', '15:00', '6182301015'),
('Jumat',  '07:00', '09:00', '6182301015');

-- 6182301019
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '13:00', '15:00', '6182301019'),
('Rabu',   '07:00', '09:00', '6182301019'),
('Kamis',  '09:00', '11:00', '6182301019');

-- 6182301099
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '10:00', '12:00', '6182301099'),
('Kamis',  '07:00', '09:00', '6182301099'),
('Jumat',  '14:00', '16:00', '6182301099');

-- 6182301054
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '09:00', '11:00', '6182301054'),
('Rabu',   '14:00', '16:00', '6182301054'),
('Jumat',  '08:00', '10:00', '6182301054');

-- 6182301058
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '07:00', '09:00', '6182301058'),
('Kamis',  '10:00', '12:00', '6182301058'),
('Jumat',  '12:00', '14:00', '6182301058');

-- 6182301017
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '08:00', '10:00', '6182301017'),
('Rabu',   '12:00', '14:00', '6182301017'),
('Kamis',  '15:00', '17:00', '6182301017');

-- 6182301010
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '14:00', '16:00', '6182301010'),
('Kamis',  '08:00', '10:00', '6182301010'),
('Jumat',  '09:00', '11:00', '6182301010');

-- 6182301040
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '07:00', '09:00', '6182301040'),
('Rabu',   '13:00', '15:00', '6182301040'),
('Jumat',  '11:00', '13:00', '6182301040');

-- 6182301005
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Selasa', '09:00', '11:00', '6182301005'),
('Kamis',  '14:00', '16:00', '6182301005'),
('Jumat',  '07:00', '09:00', '6182301005');

-- 6182301002
INSERT INTO jadwal_user (hari, jam_mulai, jam_akhir, id_users) VALUES
('Senin',  '10:00', '12:00', '6182301002'),
('Rabu',   '08:00', '10:00', '6182301002'),
('Jumat',  '15:00', '17:00', '6182301002');