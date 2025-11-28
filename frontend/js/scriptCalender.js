/* =========================================
   BAGIAN 1: LOGIKA KALENDER BULANAN (UPDATED)
   ========================================= */
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Data Dummy Jadwal Kalender
const dataJadwal = {
    "2025-04-18": [ { title: "Bimbingan 7", name: "Vania Natali", type: "pink-bg" } ], // Saya ubah tahun ke 2025-04 sesuai gambar
    "2025-04-01": [ { title: "Bimbingan 5", name: "Vania Natali", type: "green-bg" } ], 
    "2025-04-08": [ { title: "Bimbingan 6", name: "Vania Natali", type: "green-bg" } ],
    "2025-04-26": [ { title: "Bimbingan 8", name: "Raymond", type: "blue-bg" } ]
};

let thisDay = new Date();
let currentYear = 2025; // Hardcode ke 2025 sesuai desain
let currentMonth = 3;   // 3 = April (Jan=0)

function generateCalendarGrid(year, month) {
    const calendarContainer = document.querySelector('div.month_calendar');
    
    // Safety check
    if (!calendarContainer) return; 

    calendarContainer.innerHTML = ''; 

    // 1. Render Nama Hari
    dayNames.forEach(d => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-name';
        dayLabel.textContent = d;
        calendarContainer.appendChild(dayLabel);
    });

    // 2. Logika Grid 42 Kotak
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalCells = 42; 

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'date-cell';
        
        let dateDisplay;
        let isCurrentMonth = false;
        
        // --- LOGIKA ANGKA TANGGAL ---
        if (i < firstDayIndex) {
            dateDisplay = prevMonthDays - (firstDayIndex - 1) + i;
            cell.classList.add('other-month');
        } else if (i >= firstDayIndex && i < firstDayIndex + daysInMonth) {
            dateDisplay = i - firstDayIndex + 1;
            isCurrentMonth = true;

            // Cek Hari Ini (Optional)
            const today = new Date();
            if (dateDisplay === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }
        } else {
            dateDisplay = i - (firstDayIndex + daysInMonth) + 1;
            cell.classList.add('other-month');
        }

        const dateNumSpan = document.createElement('span');
        dateNumSpan.className = 'date-num';
        dateNumSpan.textContent = dateDisplay;
        cell.appendChild(dateNumSpan);

        // --- LOGIKA EVENT (WARNAI CELL) ---
        if (isCurrentMonth) {
            Object.keys(dataJadwal).forEach(key => {
                const eventDate = new Date(key);
                
                // Cek apakah tanggal cocok
                if (eventDate.getFullYear() === year && 
                    eventDate.getMonth() === month && 
                    eventDate.getDate() === dateDisplay) {
                    
                    dataJadwal[key].forEach(ev => {
                        // 1. Tambahkan class warna ke PARENT (Cell)
                        cell.classList.add(ev.type);
                        
                        // 2. Tambahkan Teks Detail (Tanpa Bubble)
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'event-details';
                        infoDiv.innerHTML = `
                            <div class="event-title">${ev.title}</div>
                            <div class="event-name">${ev.name}</div>
                        `;
                        cell.appendChild(infoDiv);
                    });
                }
            });
        }
        calendarContainer.appendChild(cell);
    }
}


/* =========================================
   BAGIAN 2: LOGIKA JADWAL MINGGUAN (TETAP)
   ========================================= */

// Data Dummy Jadwal Kuliah Mingguan
const jadwalKuliah = [
    { day: 'Senin', title: 'Pemrograman Berbasis Web', time: '07:00', end: '10:00', room: 'R. Kuliah • 09.00.0018', color: 'bg-teal' },
    { day: 'Senin', title: 'Artificial Intelligence', time: '13:00', end: '15:00', room: 'R. Kuliah', color: 'bg-pink' },
    { day: 'Senin', title: 'Rekayasa Perangkat Lunak', time: '15:00', end: '17:00', room: 'R. Kuliah', color: 'bg-blue-dark' },
    { day: 'Selasa', title: 'Manajemen Proyek', time: '08:00', end: '10:00', room: 'R. Kuliah', color: 'bg-red' },
    { day: 'Rabu', title: 'Pengantar dan Aplikasi', time: '10:00', end: '12:30', room: 'Lab • 09.00.0018', color: 'bg-orange' },
    { day: 'Rabu', title: 'Rekayasa Perangkat Lunak', time: '13:00', end: '15:00', room: 'Lab', color: 'bg-blue-dark' },
    { day: 'Rabu', title: 'Desain Antarmuka Grafis', time: '15:00', end: '17:00', room: 'R. Kuliah', color: 'bg-olive' },
    { day: 'Kamis', title: 'Pemrograman Berbasis Web', time: '10:00', end: '12:00', room: 'Lab', color: 'bg-blue-light' },
    { day: 'Kamis', title: 'Artificial Intelligence', time: '15:00', end: '17:00', room: 'R. Kuliah', color: 'bg-pink' },
    { day: 'Jumat', title: 'Rekayasa Perangkat Lunak', time: '07:00', end: '09:00', room: '-', color: 'bg-blue-dark' },
    { day: 'Jumat', title: 'Sistem Big Data', time: '09:00', end: '11:30', room: 'R. Kuliah • 09.07.0010', color: 'bg-purple' }
];

const dayMap = { 'Senin': 2, 'Selasa': 3, 'Rabu': 4, 'Kamis': 5, 'Jumat': 6 };

function getRowFromTime(timeString) {
    const [hour, minute] = timeString.split(':').map(Number);
    const startHour = 7; 
    let row = (hour - startHour) * 2 + 1;
    if (minute >= 30) row += 1;
    return row;
}

function renderSchedule() {
    const container = document.getElementById('scheduleGrid');
    if (!container) return; 

    const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    hours.forEach(h => {
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = `${h.toString().padStart(2, '0')}:00`;
        timeLabel.style.gridRow = getRowFromTime(`${h}:00`);
        container.appendChild(timeLabel);

        const line = document.createElement('div');
        line.className = 'grid-line';
        line.style.gridRow = getRowFromTime(`${h}:00`);
        container.appendChild(line);
    });

    jadwalKuliah.forEach(item => {
        const startRow = getRowFromTime(item.time);
        const endRow = getRowFromTime(item.end);
        const duration = endRow - startRow; 
        const column = dayMap[item.day];

        const card = document.createElement('div');
        card.className = `class-card ${item.color}`;
        
        card.style.gridColumn = column;
        card.style.gridRow = `${startRow} / span ${duration}`;

        card.innerHTML = `
            <div class="class-title">${item.title}</div>
            <div class="class-info">${item.time} - ${item.end}</div>
            <div class="class-info">${item.room}</div>
        `;

        container.appendChild(card);
    });
}

// TOGGLE LOGIC (Switch view)
document.addEventListener("DOMContentLoaded", () => {
    generateCalendarGrid(currentYear, currentMonth);
    renderSchedule();

    const viewToggle = document.getElementById('viewToggle');
    const monthlyView = document.querySelector('.kalender-bulanan');
    const weeklyView = document.querySelector('.kalender-mingguan');

    viewToggle.addEventListener('change', function() {
        if(this.checked) {
            monthlyView.classList.add('hidden');
            weeklyView.classList.remove('hidden');
        } else {
            monthlyView.classList.remove('hidden');
            weeklyView.classList.add('hidden');
        }
    });
});