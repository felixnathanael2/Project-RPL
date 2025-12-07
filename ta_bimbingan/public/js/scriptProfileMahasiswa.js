// public/js/scriptProfileMahasiswa.js

document.addEventListener("DOMContentLoaded", async () => {
    
    // Helper function untuk memperbarui innerText
    const setText = (elementId, text, fallback = 'Belum Tersedia') => {
        const element = document.getElementById(elementId);
        // Kita hanya mengisi elemen yang ADA di HTML.
        if (element) {
            element.innerText = text || fallback; 
        }
    };

    try {
        // Fetch data dari API endpoint 
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
            throw new Error(`Gagal mengambil data profil Mahasiswa. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update Data Profil UTAMA (Data yang tersedia di DB: nama, id, email)
        
        // Informasi Utama
        setText("profile-nama", data.nama);
        setText("profile-role-id", `Sarjana | ${data.id_users}`); // Menggabungkan Role & NPM
        setText("profile-email", data.email);
        
        // Update Data STATIS / FALLBACK
        // Data ini disetel ke nilai statis/fallback karena tidak tersedia dari API.
        // setText("profile-prodi", 'Informatika'); 
        // setText("profile-fakultas", 'Sains');
        
        // Update Data Dosen Pembimbing
        // Data ini diambil secara terpisah di Controller.
        if (data.pembimbing) {
            // Asumsi data.pembimbing mengembalikan objek seperti {pembimbing1: 'Nama Dosen', pembimbing2: 'Nama Dosen'}
            setText("dosbim-1", data.pembimbing.pembimbing1 || 'Belum Ditentukan');
            setText("dosbim-2", data.pembimbing.pembimbing2 || 'Belum Ditentukan');
        } else {
            setText("dosbim-1", 'Belum Ditentukan');
            setText("dosbim-2", 'Belum Ditentukan');
        }
        


    } catch (error) {
        console.error("Error loading profile data (Mahasiswa):", error);
        setText("profile-nama", "Gagal Memuat Data");
        setText("profile-role-id", "Cek Koneksi atau API Server");
        setText("profile-email", "Error");
    }
});