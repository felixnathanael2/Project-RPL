/* 
   Logika Kalender Bulanan
*/
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

let dataJadwal = {};

let thisDay = new Date();
let currentYear = thisDay.getFullYear();
let currentMonth = thisDay.getMonth();

//  update Side Box Tanggal 
function updateCurrentDate() {
    const today = new Date();

    const namaHariIndo = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const namaBulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

    const hariID = document.getElementById('hari');
    const bulanID = document.getElementById('bulan');
    const tanggalID = document.getElementById('tanggal');

    if (hariID && bulanID && tanggalID) {

        hariID.textContent = namaHariIndo[today.getDay()];
        bulanID.textContent = namaBulanIndo[today.getMonth()];

        // pake padStart biar '1' jadi '01'
        tanggalID.textContent = String(today.getDate()).padStart(2, '0');
    }
}

// fetch data dari db ke frontend
async function fetchJadwalBimbingan() {
    try {
        const response = await fetch('/api/jadwal-bimbingan');
        const rawData = await response.json();

        dataJadwal = {};

        rawData.forEach(item => {
            const jamDisplay = item.waktu.substring(0, 5);

            //kasi warna random, kalo mau di if bole yak
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
function updateHeaderAndGrid() {
    // judul bulan - tahun kalender
    const headerText = document.querySelector('#right-header p');
    if (headerText) {
        headerText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    generateCalendarGrid(currentYear, currentMonth);
}

function generateCalendarGrid(year, month) {
    const calendarContainer = document.querySelector('div.month_calendar');
    if (!calendarContainer) return;

    //biar kalo di next kerest semua 
    calendarContainer.innerHTML = ''

    //  render table header 
    dayNames.forEach(d => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-name';
        dayLabel.textContent = d;
        calendarContainer.appendChild(dayLabel);
    });

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Grid 6 baris x 7 kolom = 42 sel
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'date-cell';

        let dateDisplay;
        let isCurrentMonth = false;
        let cellKey = null;

        if (i < firstDayIndex) {
            // render tanggal bulan lalu
            dateDisplay = prevMonthDays - (firstDayIndex - 1) + i;
            cell.classList.add('other-month');
        } else if (i >= firstDayIndex && i < firstDayIndex + daysInMonth) {
            // render tanggal bulan ini 
            dateDisplay = i - firstDayIndex + 1;
            isCurrentMonth = true;

            // bikin format YYYY-MM-DD untuk indexing array dari backend 
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dateDisplay).padStart(2, '0');
            cellKey = `${year}-${mStr}-${dStr}`;

            //render tanggal hari ini agar stylenya bagus
            const today = new Date();
            if (dateDisplay === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }
        } else {
            // render tanggal bulan depan
            dateDisplay = i - (firstDayIndex + daysInMonth) + 1;
            cell.classList.add('other-month');
        }

        // kasi nomor tanggal di (1, 2, ..., 31)
        const dateNumSpan = document.createElement('span');
        dateNumSpan.className = 'date-num';
        dateNumSpan.textContent = dateDisplay;
        cell.appendChild(dateNumSpan);

        // render bimbingan yang ada dari backend 
        if (isCurrentMonth && cellKey && dataJadwal[cellKey]) {
            dataJadwal[cellKey].forEach(ev => {
                // kasi warna background 
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


/* 
   logika jadwal mingguan 
*/

let jadwalKuliah = [];

// kasi warna acak biar ga monoton
const colors = ['bg-teal', 'bg-pink', 'bg-blue-dark', 'bg-red', 'bg-orange', 'bg-olive', 'bg-purple'];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// fetch API Jadwal Mingguan
async function fetchJadwalMingguan() {
    try {
        const response = await fetch('/api/my-schedule'); //api beckend
        const result = await response.json();

        // kosongin data lama
        jadwalKuliah = [];

        if (result.status === 'success' && Array.isArray(result.data)) {
            // mapping Data DB (snake_case) ke Data Frontend (camelCase)
            jadwalKuliah = result.data.map(item => {
                return {
                    day: item.hari, 
                    // Ambil 5 karakter pertama (07:00:00 -> 07:00)
                    time: item.jam_mulai.substring(0, 5),
                    end: item.jam_akhir.substring(0, 5),

                    // pake default value soalnya db ga nyimpen matkul sama ruangan
                    title: "Jadwal Kuliah",
                    room: "R. Kuliah",

                    color: getRandomColor()
                };
            });
        }

        // render ulang jadwal setelah data masuk
        renderSchedule();

    } catch (error) {
        console.error("Gagal mengambil jadwal kuliah:", error);
    }
}

const dayMap = { 'Senin': 2, 'Selasa': 3, 'Rabu': 4, 'Kamis': 5, 'Jumat': 6 };

function getRowFromTime(timeString) {
    if (!timeString) return 1;
    const [hour, minute] = timeString.split(':').map(Number);
    const startHour = 7;
    let row = (hour - startHour) * 2 + 1;
    if (minute >= 30) row += 1;
    return row;
}

function renderSchedule() {
    const container = document.getElementById('scheduleGrid');
    if (!container) return;

    // kosongin container dulu sebelum render ulang
    container.innerHTML = '';

    // Render Garis Waktu 
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

    // render Kartu Jadwal
    jadwalKuliah.forEach(item => {
        // Cek apakah hari valid (Senin-Jumat aja)
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

// initialisasi 

document.addEventListener("DOMContentLoaded", () => {
    //render semua data dulu sblm dibikin eventlistneer
    updateCurrentDate();
    fetchJadwalBimbingan();
    fetchJadwalMingguan();

    // buat pindah antara bulanan atau mingguan
    const viewToggle = document.getElementById('viewToggle');
    const monthlyView = document.querySelector('.kalender-bulanan');
    const rightHeader = document.querySelector('#right-header');
    const weeklyView = document.querySelector('.kalender-mingguan');
    //setting biar defaultnya monthly dulu
    monthlyView.classList.remove('hidden');
    rightHeader.classList.remove('hidden');
    weeklyView.classList.add('hidden');

    if (viewToggle && monthlyView && weeklyView) {
        viewToggle.addEventListener('change', function () {
            //gonta ganti mode bulanan/mingguan
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

    //buat menangani prev next button biar bisa ke bulan lalu dan bulan depan
    const btnNext = document.querySelector('.ri-arrow-right-s-line');
    const btnPrev = document.querySelector('.ri-arrow-left-s-line');

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            updateHeaderAndGrid();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            updateHeaderAndGrid();
        });
    }
});