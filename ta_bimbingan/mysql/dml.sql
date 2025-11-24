INSERT INTO Admin (email, password) VALUES
('admin@unpar.ac.id', 'admin123');

INSERT INTO Dosen_Pembimbing (NIK, nama_Dosen, email_Dosen, password) VALUES
('20100001', 'Dr. Andi Saputra', 'andi.saputra@unpar.ac.id', 'pass123'),
('20120005', 'Dr. Maria Gunawan', 'maria.gunawan@unpar.ac.id', 'pass123'),
('20130010', 'Dr. Budi Hartono', 'budi.hartono@unpar.ac.id', 'pass123'),
('20150012', 'Dr. Clara Wijaya', 'clara.wijaya@unpar.ac.id', 'pass123');

INSERT INTO Mahasiswa_TA 
(NPM, nama_Mahasiswa, email_Mahasiswa, password, angkatan, Topik, TA1, TA2) VALUES
('6182101001', 'Jason Pratama', 'jason21@unpar.ac.id', 'pass1', 2021, 'Sistem Rekomendasi Film', TRUE, FALSE),
('6182101002', 'Michelle Tan', 'michelle21@unpar.ac.id', 'pass1', 2021, 'Machine Learning untuk Deteksi Emosi', TRUE, FALSE),
('6182101003', 'Rafi Santoso', 'rafi21@unpar.ac.id', 'pass1', 2021, 'Deep Learning for Traffic Sign Recognition', TRUE, FALSE),
('6182201001', 'Kevin Aditya', 'kevin22@unpar.ac.id', 'pass1', 2022, 'Optimasi Jadwal Kuliah', FALSE, FALSE),
('6182201002', 'Aurelia Chandra', 'aurelia22@unpar.ac.id', 'pass1', 2022, 'Chatbot dengan NLP', FALSE, FALSE);

INSERT INTO Plotting_Pembimbing (NPM, NIK, status_pembimbing) VALUES
('6182101001', '20100001', 'Pembimbing 1'),
('6182101001', '20120005', 'Pembimbing 2'),
('6182101002', '20130010', 'Pembimbing 1'),
('6182101003', '20150012', 'Pembimbing 1');

INSERT INTO Lokasi (namaRuangan, statusRuangan) VALUES
('Ruang 9013', 'Tersedia'),
('Ruang 9014', 'Tersedia'),
('Ruang 9015', 'Penuh'),
('Ruang 9016', 'Tersedia'),
('Ruang 9017', 'Tersedia'),
('Ruang 9018', 'Tersedia'),
('Ruang Sidang', 'Penuh');

INSERT INTO Rentang_Semester (namaSemester, tanggalAwalSemester, tanggalUTSSelesai, tanggalUASSelesai) VALUES
('Ganjil 2024/2025', '2024-08-01', '2024-10-15', '2024-12-20');

INSERT INTO Bimbingan (
    tanggal_Waktu_Bimbingan, catatan_Bimbingan, status, NPM, idLokasi
) VALUES
('2025-01-10 09:00:00', 'Bahas outline awal', 'Menunggu', '6182101001', 1),
('2025-01-12 10:00:00', 'Revisi bab 1', 'Disetujui', '6182101002', 2),
('2025-01-15 14:00:00', 'Diskusi dataset', 'Selesai', '6182101003', 4),
('2025-01-18 08:00:00', 'Cek progress minggu ini', 'Menunggu', '6182201001', 1),
('2025-01-20 13:00:00', 'Review NLP model', 'Disetujui', '6182201002', 2);

INSERT INTO Bimbingan_Dosen (idBimbingan, NIK) VALUES
(1, '20100001'),
(1, '20120005'),
(2, '20130010'),
(3, '20150012'),
(4, '20100001'),
(5, '20120005');

INSERT INTO Notifikasi (isi, NPM, NIK) VALUES
('Jadwal bimbingan Anda telah disetujui', '6182101002', NULL),
('Mohon revisi Bab 1 sebelum bimbingan berikutnya', '6182101001', '20100001'),
('Bimbingan selesai, silakan upload revisi', '6182101003', '20150012'),
('Pengingat: Bimbingan minggu ini jam 08:00', '6182201001', '20100001');

INSERT INTO Jadwal_User (Hari, Jam_Mulai, Jam_Akhir, NIK) VALUES
('Senin', '08:00:00', '10:00:00', '20100001'),
('Rabu', '13:00:00', '15:00:00', '20120005'),
('Kamis', '09:00:00', '11:00:00', '20130010');

INSERT INTO Jadwal_User (Hari, Jam_Mulai, Jam_Akhir, NPM) VALUES
('Senin', '10:00:00', '12:00:00', '6182101001'),
('Selasa', '08:00:00', '11:00:00', '6182101002'),
('Jumat', '13:00:00', '15:00:00', '6182101003'),
('Rabu', '07:00:00', '09:00:00', '6182201001'),
('Kamis', '08:00:00', '10:00:00', '6182201002');
