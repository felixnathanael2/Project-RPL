document.getElementById("lanjutButton").onclick = function () {
    let status = document.getElementById("status").value;
    if (status === "Dosen") {
        window.location.href = "TambahPenggunaAdminLanjut_Dosen.html";
    }else{
        window.location.href = "TambahPenggunaAdminLanjut_Mahasiswa.html";
    }
};