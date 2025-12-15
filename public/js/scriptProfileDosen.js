// public/js/scriptProfileMahasiswa.js

// mengatur innerText dari HTML
document.addEventListener("DOMContentLoaded", async () => {
  const setText = (elementId, text, fallback = "Belum Tersedia") => {
    const element = document.getElementById(elementId);

    if (element) {
      element.innerText = text || fallback;
    }
  };

  try {
    const response = await fetch("/api/profile");

    if (!response.ok) {
      throw new Error(
        `Gagal mengambil data profil Dosen. Status: ${response.status}`
      );
    }

    const data = await response.json();

    // Menampilkan Data ke HTML
    setText("profile-nama", data.nama);
    setText("profile-role-id", `Dosen | ${data.id_users}`);
    setText("profile-email", data.email);

    // setText("profile-prodi", 'Informatika');
    // setText("profile-fakultas", 'Sains');

    // if (data.pembimbing) {
    //     setText("dosbim-1", data.pembimbing.pembimbing1 || 'Belum Ditentukan');
    //     setText("dosbim-2", data.pembimbing.pembimbing2 || 'Belum Ditentukan');
    // } else {
    //     setText("dosbim-1", 'Belum Ditentukan');
    //     setText("dosbim-2", 'Belum Ditentukan');
    // }
    
  } catch (error) { //Menangani Error
    console.error("Error loading profile data (Mahasiswa):", error);
    setText("profile-nama", "Gagal Memuat Data");
    setText("profile-role-id", "Cek Koneksi atau API Server");
    setText("profile-email", "Error");
  }
});
