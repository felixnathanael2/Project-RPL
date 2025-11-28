const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Data Dummy Jadwal
const dataJadwal = {
    "2025-11-18": [
        { title: "Bimbingan 7", name: "Vania Natali", type: "pink-bg" },
    ],
    "2025-11-01": [
        { title: "Bimbingan 5", name: "Vania Natali", type: "green-bg" },
    ],
    "2025-10-08": [
        { title: "Bimbingan 6", name: "Vania Natali", type: "green-bg" },
    ],
    "2025-10-26": [{ title: "Bimbingan 8", name: "Raymond", type: "blue-bg" }],
};

let thisDay = new Date();
let currentYear = thisDay.getFullYear();
let currentMonth = thisDay.getMonth();

function generateCalendarGrid(year, month) {
    const calendarContainer = document.querySelector("div.month_calendar");
    calendarContainer.innerHTML = ""; // Bersihkan isi container

    // 1. Render Nama Hari (Baris Pertama)
    dayNames.forEach((d) => {
        const dayLabel = document.createElement("div");
        dayLabel.className = "day-name";
        dayLabel.textContent = d;
        calendarContainer.appendChild(dayLabel);
    });

    // 2. Logika Grid 6 Baris (Total 42 Kotak)
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Minggu, 1 = Senin, dst
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Kita memaksa grid selalu memiliki 42 sel (6 minggu x 7 hari)
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.className = "date-cell";

        let dateDisplay;
        let isCurrentMonth = false;

        // --- LOGIKA TANGGAL ---
        if (i < firstDayIndex) {
            // Tanggal Bulan Lalu
            dateDisplay = prevMonthDays - (firstDayIndex - 1) + i;
            cell.classList.add("other-month");
        } else if (i >= firstDayIndex && i < firstDayIndex + daysInMonth) {
            // Tanggal Bulan Ini
            dateDisplay = i - firstDayIndex + 1;
            isCurrentMonth = true;

            // Cek Hari Ini
            const today = new Date();
            if (
                dateDisplay === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                cell.classList.add("today");
            }
        } else {
            // Tanggal Bulan Depan
            dateDisplay = i - (firstDayIndex + daysInMonth) + 1;
            cell.classList.add("other-month");
        }

        // --- RENDER ANGKA ---
        const dateNumSpan = document.createElement("span");
        dateNumSpan.className = "date-num";
        dateNumSpan.textContent = dateDisplay;
        cell.appendChild(dateNumSpan);

        // --- RENDER EVENT (Hanya untuk bulan aktif) ---
        // Catatan: Logic ini simplified untuk mencocokkan data dummy Anda
        if (isCurrentMonth) {
            // Kita coba match data dummy manual
            Object.keys(dataJadwal).forEach((key) => {
                const eventDate = new Date(key);
                if (
                    eventDate.getFullYear() === year &&
                    eventDate.getMonth() === month &&
                    eventDate.getDate() === dateDisplay
                ) {
                    dataJadwal[key].forEach((ev) => {
                        const evPill = document.createElement("div");
                        evPill.className = `event-pill ${ev.type}`;
                        // Isi pill: Title tebal, nama tipis
                        evPill.innerHTML = `<strong>${ev.title}</strong><span>${ev.name}</span>`;
                        cell.appendChild(evPill);
                    });
                }
            });
        }

        calendarContainer.appendChild(cell);
    }
}

// Jalankan saat load
document.addEventListener("DOMContentLoaded", async () => {
    // ini buat calendar
    generateCalendarGrid(currentYear, currentMonth);

    //ini  buat bimbingan
    const res = await fetch("/api/riwayat", {
        credentials: "include"
    });

    const { data } = await res.json();

    console.info("🚀 ~ data:", data)

    for (const bimbingan of data) {
        const {nama, nama_ruangan, tanggal, waktu, catatan_bimbingan, status} = bimbingan;

        // nanti masuk masukin ke page disini yaaa
    }
});
