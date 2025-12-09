let dataUsers = [];
async function fetchDataUsers() {
    try {
        const response = await fetch('/api/manajemen-pengguna')
        dataUsers = await response.json();

        console.log("DATA PENGGUNA : " + dataUsers);

        renderTabel()
    } catch (error) {
        console.error("Gagal mengambil data user")
    }
}

async function renderTabel() {
    const tableBody = document.getElementById("mpTableBody");

    if (dataUsers.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='3'>Tidak ada data</td></tr>";
        return;
    }

    if (tableBody) {
        tableBody.innerHTML = "";
        dataUsers.forEach(log => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${log.email}</td>
                <td>${log.status}</td>
                <td>${log.semester}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}


function addUsers() {
    try {
        window.location.href = "/addUser";
    } catch (error) {
        console.error("Error saat logout:", error);
        alert("Terjadi kesalahan koneksi.");
    }
}


document.addEventListener("DOMContentLoaded", function () {

    fetchDataUsers();
    const addBtn = document.querySelector('button.btn-add');
    addBtn.addEventListener('click', addUsers)
});