document.addEventListener("DOMContentLoaded", function () {

    // SIMULASI DATA
    const mockLogs = [
        { email: "6182301015@student.unpar.ac.id", status: "Mahasiswa", semester: "57" },
        { email: "6182201001@student.unpar.ac.id", status: "Mahasiswa", semester: "57" },
        { email: "6182101100@student.unpar.ac.id", status: "Mahasiswa", semester: "57" },
        { email: "6182301003@student.unpar.ac.id", status: "Mahasiswa", semester: "57" },
        { email: "6182301099@student.unpar.ac.id", status: "Mahasiswa", semester: "57" },
        { email: "raymond.chandra@unpar.ac.id", status: "Dosen", semester: "-" },
        { email: "g.karya@unpar.ac.id", status: "Dosen", semester: "-" },
        { email: "6182301055@student.unpar.ac.id", status: "Mahasiswa", semester: "57" },
        { email: "admin1@admin", status: "Administrator", semester: "-" },
        { email: "vania.natali@unpar.ac.id", status: "Dosen", semester: "-" }
    ];

    const tableBody = document.getElementById("mpTableBody");

    if (tableBody) {
        tableBody.innerHTML = "";
        mockLogs.forEach(log => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${log.email}</td>
                <td>${log.status}</td>
                <td>${log.semester}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});