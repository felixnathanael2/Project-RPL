document.getElementById("lanjutButton").onclick = function () {
  const email = document.getElementById("email").value;
  const status = document.getElementById("status").value;

  if (!email || !status) {
    alert("Harap isi Email dan Status terlebih dahulu!");
    return;
  }

  //simpen sementara ke session storage
  sessionStorage.setItem("temp_email", email);
  sessionStorage.setItem("temp_role", status);
  try {
    //redirect ke halaman lanjut
    if (status === "Dosen") {
      window.location.href = "/addUser/dosen";
    } else if (status === "Mahasiswa") {
      window.location.href = "/addUser/mahasiswa";
    }
  } catch (error) {
    console.error("Error saat tambah akun:", error);
    alert("Terjadi kesalahan koneksi.");
  }
};
