//buat data nya bisa dieksport ke plug in
let globalLogData = [];

async function fetchLogData() {
  try {
    const response = await fetch("/api/log-data");
    const rawData = await response.json();
    globalLogData = rawData;
    const tableBody = document.getElementById("logTableBody");

    if (tableBody) {
      if (rawData && rawData.length > 0) {
        tableBody.innerHTML = "";
        rawData.forEach((log) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${log.email}</td>
                        <td>${log.aksi}</td>
                        <td>${log.waktu}</td>
                    `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan='3' style="text-align:center;">Tidak ada log aktivitas</td></tr>`;
      }
    }
  } catch (error) {
    console.error("Gagal mengambil log admin:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchLogData();
});

// buat download excel
function downloadLog() {
  //cek apakah si global data ini udah ada lognya blm
  if (globalLogData.length === 0) {
    alert("Tidak ada data untuk diunduh!");
    return;
  }

  //bikin header excel yang sesuai format
  const dataToExport = globalLogData.map((item) => ({
    "Email Pengguna": item.email,
    Aktivitas: item.aksi,
    Waktu: item.waktu,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  //atur ukuran tiap kolom
  const wscols = [
    { wch: 30 }, // lebar kolom Email
    { wch: 40 }, // lebar kolom Aksi
    { wch: 20 }, // lebar kolom Waktu
  ];
  worksheet["!cols"] = wscols;

  //bkin workbook baru dengan nama Log Aktivitas
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Log Aktivitas");

  //generate file excel dan download
  XLSX.writeFile(workbook, "Log_Aktivitas_Admin.xlsx");
}
