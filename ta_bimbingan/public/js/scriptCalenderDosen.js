/* =========================================
   BAGIAN 1: KALENDER BULANAN
   ========================================= */

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const dataJadwal = {
    "2025-04-01": [
        { title: "Bimbingan 5", name: "Joseph", type: "green-bg" }
    ],
    "2025-04-08": [
        { title: "Bimbingan 6", name: "Joseph", type: "green-bg" }
    ],
    "2025-04-18": [
        { title: "Bimbingan 7", name: "Joseph", type: "pink-bg" }
    ],
    "2025-04-19": [
        { title: "Bimbingan 7", name: "Michael", type: "yellow-bg" }
    ]
};

let currentYear = 2025;
let currentMonth = 3; // April (0 = Jan)

function generateCalendarGrid(year, month) {
    const calendarContainer = document.querySelector("div.month_calendar");
    if (!calendarContainer) return;

    calendarContainer.innerHTML = "";

    // Nama hari
    dayNames.forEach(day => {
        const d = document.createElement("div");
        d.className = "day-name";
        d.textContent = day;
        calendarContainer.appendChild(d);
    });

    // Hitung tanggal
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.className = "date-cell";

        let dateNumber;
        let isCurrentMonth = false;

        if (i < firstDayIndex) {
            dateNumber = prevMonthDays - (firstDayIndex - 1) + i;
            cell.classList.add("other-month");
        }
        else if (i >= firstDayIndex && i < firstDayIndex + daysInMonth) {
            dateNumber = i - firstDayIndex + 1;
            isCurrentMonth = true;

            // tanda hari ini (opsional)
            const today = new Date();
            if (
                dateNumber === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                cell.classList.add("today");
            }
        }
        else {
            dateNumber = i - (firstDayIndex + daysInMonth) + 1;
            cell.classList.add("other-month");
        }

        // Angka tanggal
        const span = document.createElement("span");
        span.className = "date-num";
        span.textContent = dateNumber;
        cell.appendChild(span);

        // Cek event
        if (isCurrentMonth) {
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNumber).padStart(2, '0')}`;

            if (dataJadwal[key]) {
                dataJadwal[key].forEach(ev => {
                    cell.classList.add(ev.type);

                    const info = document.createElement("div");
                    info.className = "event-details";
                    info.innerHTML = `
                        <div class="event-title">${ev.title}</div>
                        <div class="event-name">${ev.name}</div>
                    `;
                    cell.appendChild(info);
                });
            }
        }

        calendarContainer.appendChild(cell);
    }
}

/* =========================================
   BAGIAN 2: JADWAL MINGGUAN
   ========================================= */

const jadwalKuliah = [
    { day: 'Senin', title: 'Bimbingan TI', time: '09:00', end: '10:00', room: 'R. 10-1', color: 'bg-teal' },
    { day: 'Rabu', title: 'Bimbingan KP', time: '13:00', end: '15:00', room: 'Lab 1', color: 'bg-blue-dark' },
    { day: 'Jumat', title: 'Sidang Internal', time: '10:00', end: '12:00', room: 'R. AULA', color: 'bg-purple' },
];

const dayMap = { 'Senin': 2, 'Selasa': 3, 'Rabu': 4, 'Kamis': 5, 'Jumat': 6 };

function getRowFromTime(timeString) {
    const [hour, minute] = timeString.split(":").map(Number);
    const start = 7;
    let row = (hour - start) * 2 + 1;
    if (minute >= 30) row++;
    return row;
}

function renderSchedule() {
    const grid = document.getElementById("scheduleGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    hours.forEach(h => {
        const label = document.createElement("div");
        label.className = "time-label";
        label.textContent = `${String(h).padStart(2, '0')}:00`;
        label.style.gridRow = getRowFromTime(`${h}:00`);
        grid.appendChild(label);

        const line = document.createElement("div");
        line.className = "grid-line";
        line.style.gridRow = getRowFromTime(`${h}:00`);
        grid.appendChild(line);
    });

    jadwalKuliah.forEach(j => {
        const start = getRowFromTime(j.time);
        const end = getRowFromTime(j.end);
        const col = dayMap[j.day];

        const card = document.createElement("div");
        card.className = `class-card ${j.color}`;
        card.style.gridColumn = col;
        card.style.gridRow = `${start} / span ${end - start}`;

        card.innerHTML = `
            <div class="class-title">${j.title}</div>
            <div class="class-info">${j.time} - ${j.end}</div>
            <div class="class-info">${j.room}</div>
        `;

        grid.appendChild(card);
    });
}

/* =========================================
   TOGGLE SWITCH
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    generateCalendarGrid(currentYear, currentMonth);
    renderSchedule();

    const toggle = document.getElementById("viewToggle");
    const monthView = document.querySelector(".kalender-bulanan");
    const weekView = document.querySelector(".kalender-mingguan");

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            weekView.classList.remove("hidden");
            monthView.classList.add("hidden");
        } else {
            monthView.classList.remove("hidden");
            weekView.classList.add("hidden");
        }
    });
});
