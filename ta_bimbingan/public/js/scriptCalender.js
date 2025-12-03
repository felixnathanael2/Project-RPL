// Logika Kalender Bulanan

export const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export let dataJadwal = {};

export let thisDay = new Date();
export let currentYear = thisDay.getFullYear();
export let currentMonth = thisDay.getMonth();

//  update Side Box Tanggal
export function updateCurrentDate() {
    const today = new Date();

    const namaHariIndo = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const namaBulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

    const hariID = document.getElementById('hari');
    const bulanID = document.getElementById('bulan');
    const tanggalID = document.getElementById('tanggal');

    if (hariID && bulanID && tanggalID) {
        hariID.textContent = namaHariIndo[today.getDay()];
        bulanID.textContent = namaBulanIndo[today.getMonth()];
        tanggalID.textContent = String(today.getDate()).padStart(2, '0');
    }
}

// fetch data dari db ke frontend
export async function fetchJadwalBimbingan() {
    try {
        const response = await fetch('/api/jadwal-bimbingan');
        const rawData = await response.json();

        // Reset object (karena const/let di module binding)
        for (const key in dataJadwal) delete dataJadwal[key];

        rawData.forEach(item => {
            const jamDisplay = item.waktu.substring(0, 5);
            let bgColorType = ["green-bg", "blue-bg", "pink-bg"];
            const colorType = bgColorType[Math.floor(Math.random() * bgColorType.length)];

            if (!dataJadwal[item.tanggal]) {
                dataJadwal[item.tanggal] = [];
            }

            dataJadwal[item.tanggal].push({
                title: jamDisplay,
                name: item.nama_dosen,
                type: colorType
            });
        });

        updateHeaderAndGrid();

    } catch (error) {
        console.error("Gagal mengambil jadwal:", error);
    }
}

// render data setelah dapet fetch backend
export function updateHeaderAndGrid() {
    const headerText = document.querySelector('#right-header p');
    if (headerText) {
        headerText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    generateCalendarGrid(currentYear, currentMonth);
}

export function generateCalendarGrid(year, month) {
    const calendarContainer = document.querySelector('div.month_calendar');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = ''

    dayNames.forEach(d => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-name';
        dayLabel.textContent = d;
        calendarContainer.appendChild(dayLabel);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'date-cell';

        let dateDisplay;
        let isCurrentMonth = false;
        let cellKey = null;

        if (i < firstDayIndex) {
            dateDisplay = prevMonthDays - (firstDayIndex - 1) + i;
            cell.classList.add('other-month');
        } else if (i >= firstDayIndex && i < firstDayIndex + daysInMonth) {
            dateDisplay = i - firstDayIndex + 1;
            isCurrentMonth = true;
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dateDisplay).padStart(2, '0');
            cellKey = `${year}-${mStr}-${dStr}`;

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

        if (isCurrentMonth && cellKey && dataJadwal[cellKey]) {
            dataJadwal[cellKey].forEach(ev => {
                cell.classList.add(ev.type);
                const infoDiv = document.createElement('div');
                infoDiv.className = 'event-details';
                infoDiv.innerHTML = `
                    <div class="event-title">${ev.title}</div>
                    <div class="event-name">${ev.name}</div>
                `;
                cell.appendChild(infoDiv);
            });
        }
        calendarContainer.appendChild(cell);
    }
}


// logika jadwal mingguan

export let jadwalKuliah = []; // Export agar bisa dicek test

const colors = ['bg-teal', 'bg-pink', 'bg-blue-dark', 'bg-red', 'bg-orange', 'bg-olive', 'bg-purple'];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

export async function fetchJadwalMingguan() {
    try {
        const response = await fetch('/api/my-schedule');
        const result = await response.json();

        // Reset array
        jadwalKuliah.length = 0;

        if (result.status === 'success' && Array.isArray(result.data)) {
            const newData = result.data.map(item => {
                return {
                    day: item.hari,
                    time: item.jam_mulai.substring(0, 5),
                    end: item.jam_akhir.substring(0, 5),
                    title: "Jadwal Kuliah",
                    room: "R. Kuliah",
                    color: getRandomColor()
                };
            });
            // Push ke array global
            jadwalKuliah.push(...newData);
        }
        renderSchedule();
    } catch (error) {
        console.error("Gagal mengambil jadwal kuliah:", error);
    }
}

const dayMap = { 'Senin': 2, 'Selasa': 3, 'Rabu': 4, 'Kamis': 5, 'Jumat': 6 };

export function getRowFromTime(timeString) {
    if (!timeString) return 1;
    const [hour, minute] = timeString.split(':').map(Number);
    const startHour = 7;
    let row = (hour - startHour) * 2 + 1;
    if (minute >= 30) row += 1;
    return row;
}

export function renderSchedule() {
    const container = document.getElementById('scheduleGrid');
    if (!container) return;

    container.innerHTML = '';

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
        if (!dayMap[item.day]) return;

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

// Initialisasi (Hanya dijalankan jika di Browser, bukan di Test)
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", () => {
        // Cek elemen kunci untuk menghindari error di lingkungan test jika DOM belum siap
        if(document.getElementById('right-header')) {
            updateCurrentDate();
            fetchJadwalBimbingan();
            fetchJadwalMingguan();

            const viewToggle = document.getElementById('viewToggle');
            const monthlyView = document.querySelector('.kalender-bulanan');
            const rightHeader = document.querySelector('#right-header');
            const weeklyView = document.querySelector('.kalender-mingguan');

            // Set default view
            if(monthlyView) monthlyView.classList.remove('hidden');
            if(rightHeader) rightHeader.classList.remove('hidden');
            if(weeklyView) weeklyView.classList.add('hidden');

            if (viewToggle && monthlyView && weeklyView) {
                viewToggle.addEventListener('change', function () {
                    if (this.checked) {
                        monthlyView.classList.add('hidden');
                        rightHeader.classList.add('hidden');
                        weeklyView.classList.remove('hidden');
                    } else {
                        monthlyView.classList.remove('hidden');
                        rightHeader.classList.remove('hidden');
                        weeklyView.classList.add('hidden');
                    }
                });
            }

            // Button Prev Next
            const btnNext = document.querySelector('.ri-arrow-right-s-line');
            const btnPrev = document.querySelector('.ri-arrow-left-s-line');
            // Logic prev next bisa ditambahkan disini
        }
    });
}