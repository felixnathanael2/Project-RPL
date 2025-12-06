//tampilkan pop up
function showPopUp() {
    document.getElementById("confirmPopup").classList.add("show");
}

//kalau klik no 
if (document.getElementById("noBtn")) {
    document.getElementById("noBtn").onclick = function () {
        document.getElementById("confirmPopup").classList.remove("show");
    };
}

//kalau klik batal redirect ke halaman sblmnya
if (document.getElementById("batalButton")) {
    document.getElementById("batalButton").onclick = function () {
        //hapus jg session storage yg udah dibuat di awalnya
        sessionStorage.removeItem("temp_email");
        sessionStorage.removeItem("temp_role");
        window.location.href = "/addUser";
    };
}

// kalo yes kirim ke backend datanya
const yesBtn = document.getElementById("yesBtn");
if (yesBtn) {
    yesBtn.onclick = async function (e) {
        e.preventDefault();

        //ambil dari session storage sebelumnya
        const email = sessionStorage.getItem("temp_email");
        const roleStr = sessionStorage.getItem("temp_role");

        //kalo data ilang atoga orang nyoba pake url
        if (!email || !roleStr) {
            alert("Data sesi hilang. Silakan ulangi dari awal.");
            window.location.href = "/addUser";
            return;
        }

        const namaInput = document.getElementById("nama"); // nama mahasiswa
        const topikInput = document.querySelector('input[placeholder*="topik"]'); // topik mahasiswa

        // Khusus Mahasiswa (Dosen Pembimbing)
        // Pastikan di HTML ID-nya diperbaiki, tapi disini saya pakai selector fleksibel
        const selects = document.querySelectorAll('select');
        const dosen1 = selects[0] ? selects[0].value : null;
        const dosen2 = selects[1] ? selects[1].value : null;

        const payload = {
            email: email,
            roleString: roleStr, // "Mahasiswa" atau "Dosen"
            nama: namaInput ? namaInput.value : "",
            topik: topikInput ? topikInput.value : "",
            dosen1: dosen1,
            dosen2: dosen2
        };

        try {
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Berhasil menambahkan akun!");
                // Bersihkan session
                sessionStorage.clear();
                window.location.href = "/manajemen-pengguna";
            } else {
                alert("Gagal: " + (result.message || "Terjadi kesalahan server"));
                document.getElementById("confirmPopup").classList.remove("show");
            }
        } catch (error) {
            console.error(error);
            alert("Gagal koneksi ke server");
        }
    };
}


async function fetchAllDosen() {
    try {
        //panggil ke routes untuk membantu fetching
        const response = await fetch('/api/get-all-dosen');
        const data = await response.json();

        console.log("Data Dosen:", data);

        if (data) {
            //masukin bedasarkan id htmlnya 
            const dropdownDosen1 = document.querySelector('select#dosbing1');
            dropdownDosen1.innerHTML = ''; //kosongin semua option dummy
            const cover = document.createElement('option');
            cover.disabled;
            cover.selected;
            cover.textContent = 'Pilih salah satu dosen pembimbing ';
            dropdownDosen1.appendChild(cover);
            const dropdownDosen2 = document.querySelector('select#dosbing2');
            dropdownDosen2.innerHTML = ''; //kosongin semua option dummy
            const cover2 = document.createElement('option');
            cover2.disabled;
            cover2.selected;
            cover2.textContent = 'Tidak ada';
            dropdownDosen2.appendChild(cover2);
            const dosen = data;
            console.log(dropdownDosen1)
            console.log(dropdownDosen2)
            dosen.map(item => {
                const nama_dosen = item.nama;
                const nik = item.id_users;
                const anak = document.createElement('option');
                anak.value = nik;
                anak.textContent = nama_dosen;
                dropdownDosen1.appendChild(anak);
                const anakClone = anak.cloneNode(true);
                dropdownDosen2.appendChild(anakClone);
            });
        }


    } catch (error) {

        console.error("Gagal mengambil statistik:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAllDosen();
})