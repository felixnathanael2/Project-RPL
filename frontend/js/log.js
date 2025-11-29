document.addEventListener("DOMContentLoaded", function () {

    // SIMULASI DATA
    const mockLogs = [
        { email: "6182301015@student.unpar.ac.id", activity: "Pengajuan Bimbingan - VAN", datetime: "11/03/25 : 09.21" },
        { email: "6182201001@student.unpar.ac.id", activity: "Login", datetime: "10/03/25 : 20.34" },
        { email: "6182101100@student.unpar.ac.id", activity: "Pengajuan Bimbingan - LNV", datetime: "08/03/25 : 11.11" },
        { email: "6182301003@student.unpar.ac.id", activity: "Login", datetime: "07/03/25 : 13.21" },
        { email: "6182301099@student.unpar.ac.id", activity: "Tolak Bimbingan - GDK", datetime: "06/03/25 : 08.41" },
        { email: "raymond.chandra@unpar.ac.id", activity: "Accept Bimbingan - 23055", datetime: "06/03/25 : 08.40" },
        { email: "g.karya@unpar.ac.id", activity: "Accept Bimbingan - 23055", datetime: "06/03/25 : 07.32" },
        { email: "6182301055@student.unpar.ac.id", activity: "Pengajuan Bimbingan - GDK, RCP", datetime: "05/03/25 : 19.21" },
        { email: "admin1@admin", activity: "Add Account 23003", datetime: "03/03/25 : 10.13" },
        { email: "vania.natali@unpar.ac.id", activity: "Accept Bimbingan - 23099", datetime: "03/03/25 : 08.01" }
    ];

    const tableBody = document.getElementById("logTableBody");

    if (tableBody) {
        tableBody.innerHTML = "";
        mockLogs.forEach(log => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${log.email}</td>
                <td>${log.activity}</td>
                <td>${log.datetime}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});

// FUNGSI DOWNLOAD
function downloadLog() {
    alert("Mengunduh Log Activity...");
}