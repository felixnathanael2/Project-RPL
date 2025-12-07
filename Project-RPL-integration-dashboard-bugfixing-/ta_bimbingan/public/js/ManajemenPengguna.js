let selectedUserId = null; // Menyimpan ID user yang sedang diklik

document.addEventListener("DOMContentLoaded", function () {
    // Panggil fungsi untuk ambil data dari Database saat halaman dimuat
    fetchUsers();
});

// [BARU] Fungsi mengambil data dari Backend
async function fetchUsers() {
    const tableBody = document.getElementById("mpTableBody");
    if (!tableBody) return;

    // Tampilkan loading sementara
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Loading data...</td></tr>`;

    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        // Bersihkan tabel
        tableBody.innerHTML = "";

        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Tidak ada data user.</td></tr>`;
            return;
        }

        // Render baris tabel dari data Database
        users.forEach((user) => {
            const row = document.createElement("tr");
            
            // Pasang event click untuk modal detail
            row.addEventListener('click', () => openDetailModal(user));

            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.status_text || 'User'}</td>
                <td>${user.semester || '-'}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:red;">Gagal mengambil data. Cek console.</td></tr>`;
    }
}

function openDetailModal(user) {
    // Simpan ID user untuk keperluan Reset Password nanti
    selectedUserId = user.id_users;

    const detailModal = document.getElementById('detailUserModal');
    if (detailModal) {
        document.getElementById('detailNama').innerText = user.nama;
        document.getElementById('detailEmail').innerText = user.email;
        document.getElementById('detailStatus').innerText = user.status_text || user.role;
        
        if(document.getElementById('detailTopik')) document.getElementById('detailTopik').innerText = user.topik || "-";
        
        // Note: Dospem butuh query join lebih kompleks, sementara kita set strip dulu
        // atau update query repo jika ingin ditampilkan
        if(document.getElementById('detailDospem1')) document.getElementById('detailDospem1').innerText = "-"; 
        if(document.getElementById('detailDospem2')) document.getElementById('detailDospem2').innerText = "-";

        detailModal.classList.add('show');
    }
}

function closeDetailModal() {
    const detailModal = document.getElementById('detailUserModal');
    if (detailModal) detailModal.classList.remove('show');
    selectedUserId = null;
}

function openResetConfirmModal() {
    const resetModal = document.getElementById('resetPassModal');
    if (resetModal) resetModal.classList.add('show');
}

function closeResetConfirmModal() {
    const resetModal = document.getElementById('resetPassModal');
    if (resetModal) resetModal.classList.remove('show');
}

// [FIXED] Fungsi Reset Password yang BENAR-BENAR connect ke API
async function confirmResetPassword() {
    if (!selectedUserId) {
        alert("Error: User belum dipilih");
        return;
    }

    const confirmBtn = document.querySelector('.btn-confirm');
    // Ubah teks tombol biar user tau lagi loading
    const oldText = confirmBtn.innerText;
    confirmBtn.innerText = "Processing...";
    confirmBtn.disabled = true;

    try {
        // Tembak API Reset Password
        const response = await fetch(`/api/users/${selectedUserId}/reset-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (response.ok) {
            alert("Berhasil! " + result.message);
            closeResetConfirmModal();
            closeDetailModal();
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (error) {
        console.error("Error reset:", error);
        alert("Terjadi kesalahan koneksi server.");
    } finally {
        // Balikin tombol ke semula
        confirmBtn.innerText = oldText;
        confirmBtn.disabled = false;
    }
}

window.onclick = function (event) {
    const detailModal = document.getElementById('detailUserModal');
    const resetModal = document.getElementById('resetPassModal');
    if (event.target == detailModal) closeDetailModal();
    if (event.target == resetModal) closeResetConfirmModal();
}