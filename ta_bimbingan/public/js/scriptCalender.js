const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

let thisDay = new Date();
let currentYear = thisDay.getFullYear();
let currentMonth = thisDay.getMonth();


function updateCalendarHeader() {
    const headerText = document.querySelector('#right-header p');
    if (headerText) {
        headerText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}

//method untuk render kalender sekarang 
function generateCalendarGrid(year, month, dataJadwal) {
    const calendarContainer = document.querySelector('div.month_calendar');
    if (!calendarContainer) return;

    calendarContainer.style.height = "auto";
    calendarContainer.style.minHeight = "30rem";
    calendarContainer.innerHTML = '';

    // tampilin nama hari (minggu - sabtu)
    dayNames.forEach(d => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-name';
        dayLabel.textContent = d;
        calendarContainer.appendChild(dayLabel);
    });

    // logika untuk tanggal
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
            //generate tanggal di bulan sebelumnya
            dateDisplay = prevMonthDays - (firstDayIndex - 1) + i;
            cell.classList.add('other-month');
        } else if (i >= firstDayIndex && i < firstDayIndex + daysInMonth) {
            dateDisplay = i - firstDayIndex + 1;
            isCurrentMonth = true;  
            //generate tanggal di bulan ini
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dateDisplay).padStart(2, '0');
            cellKey = `${year}-${mStr}-${dStr}`;

            const today = new Date();
            if (dateDisplay === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }
        } else {
            //generate tanggal bulan depan
            dateDisplay = i - (firstDayIndex + daysInMonth) + 1;
            cell.classList.add('other-month');
        }

        const dateNumSpan = document.createElement('span');
        dateNumSpan.className = 'date-num';
        dateNumSpan.textContent = dateDisplay;
        cell.appendChild(dateNumSpan);

        // render event (misal bimbingan ke 7 )
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

//untuk ngebantu penempatan event di grid mingguan
function getRowFromTime(timeString) {
    if (!timeString) return 1;
    const [hour, minute] = timeString.split(':').map(Number);
    const startHour = 7;
    let row = (hour - startHour) * 2 + 1;
    if (minute >= 30) row += 1;
    return row;
}

const dayMap = { 'Senin': 2, 'Selasa': 3, 'Rabu': 4, 'Kamis': 5, 'Jumat': 6 };

//menampilkan jadwal yang datanya sudah dipanggil oleh scriptDashboard
function renderSchedule(jadwalKuliah) {
    const container = document.getElementById('scheduleGrid');
    if (!container) return;

    container.innerHTML = '';

    //untuk menamplkan baris waktu yang ada 
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

    // buat kartu jadwal 
    if (jadwalKuliah && jadwalKuliah.length > 0) {
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
}