document.getElementById("lanjutButton").onclick = function () {
  const email = document.getElementById("email").value;
  const status = document.getElementById("status").value;

  if (!email || !status) {
    //munculkan alert untuk user
    alert("Harap isi Email dan Status terlebih dahulu!");
    return;
  }

  //simpen sementara ke session storage
  sessionStorage.setItem("temp_email", email);
  sessionStorage.setItem("temp_role", status);
  try {
    //redirect ke halaman lanjut
    if (status === "Dosen") {
      window.location.href = "/addUser/dosen"; //jika dosen maka pindah ke url dosen
    } else if (status === "Mahasiswa") {
      window.location.href = "/addUser/mahasiswa"; //jika mahasiswa maka pindah ke url mahasiswa
    }
  } catch (error) {
    //kalo ada error
    console.error("Error saat tambah akun:", error);
    alert("Terjadi kesalahan koneksi.");
  }
};
