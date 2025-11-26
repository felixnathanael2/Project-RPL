const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const namaBulanSingkat = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];
const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let counterTodo = 4;
let thisDay = new Date();
let thisYear = thisDay.getFullYear();
let thisMonth = thisDay.getMonth();
let isShowTodo = false;

const dataJadwal = {
    "2025-10-18": [ // Contoh tanggal 18 Nov 2025 (ingat bulan di JS mulai 0, jadi Nov = 10)
        { title: "Bimbingan 7", name: "Joseph", type: "joseph-bg" },
        { title: "Bimbingan 7", name: "keren", type: "michael-bg" },
        { title: "Bimbingan 7", name: "keren", type: "michael-bg" },
        { title: "Bimbingan 8", name: "Ganteng", type: "joseph-bg" }
    ],
    "2025-11-19": [
        { title: "Bimbingan 7", name: "Michael", type: "michael-bg" }
    ],
    "2025-10-2": [
        { title: "Bimbingan 5", name: "Michael", type: "michael-bg" },
        { title: "Bimbingan 5", name: "Michael", type: "michael-bg" },
        { title: "Bimbingan 5", name: "Michael", type: "michael-bg" },
        { title: "Bimbingan 5", name: "Joseph", type: "joseph-bg" }
    ]
};

function generateMonthCalendar(year, month) {
    const mnth_cal = document.querySelector('div.month_calendar');
    // Bersihkan isi sebelumnya
    mnth_cal.innerHTML = '';

    // --- BAGIAN JUDUL & NAVIGASI (Tetap Sama) ---
    const judul = document.createElement('div');
    judul.textContent = `${namaBulan[month]} ${year}`;
    judul.className = 'calendar_title';
    mnth_cal.appendChild(judul);

    const prevContainer = document.createElement('div');
    prevContainer.className = 'next_prev_container prev_container';
    const prev = document.createElement('button');
    prev.innerHTML = "&#8249;"; // Simbol < yang lebih rapi
    prev.className = 'next_prev prev';
    prevContainer.appendChild(prev);
    mnth_cal.appendChild(prevContainer);

    const nextContainer = document.createElement('div');
    nextContainer.className = 'next_prev_container next_container';
    const next = document.createElement('button');
    next.innerHTML = "&#8250;"; // Simbol > yang lebih rapi
    next.className = 'next_prev next';
    nextContainer.appendChild(next);
    mnth_cal.appendChild(nextContainer);

    const todayContainer = document.createElement('div');
    todayContainer.className = 'next_prev_container today_container';
    const today = document.createElement('button');
    today.textContent = "Today";
    today.className = 'next_prev today';
    if (month === new Date().getMonth() && year === new Date().getFullYear()) {
        today.disabled = true;
    }
    todayContainer.appendChild(today);
    mnth_cal.appendChild(todayContainer);

    // --- LABEL HARI (Minggu, Senin, dst) ---
    for (let i = 0; i < 7; i++) {
        const label = document.createElement('div');
        label.classList.add('day_labels');
        label.textContent = day[i];
        label.style.gridRow = `2`;
        label.style.gridColumn = `${i + 1}`; // Grid column mulai dari 1
        mnth_cal.appendChild(label);
    }

    // --- LOGIKA TANGGAL ---
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const todayDate = new Date();
    const isTodayMonthYear = todayDate.getFullYear() === year && todayDate.getMonth() === month;

    let ctrRow = 3;

    // 1. TANGGAL BULAN SEBELUMNYA (Prev Month)
    for (let i = 0; i < firstDay; i++) {
        const date = daysInPrevMonth - firstDay + 1 + i;
        const dateLabel = document.createElement('div');
        dateLabel.classList.add('date_labels', 'date_labels_others');

        if (i === 0) dateLabel.classList.add('date_labels_sunday_others');
        // dateLabel.classList.add(namaBulanSingkat...); // Opsional

        const numSpan = document.createElement('span');
        numSpan.className = 'date-number';
        numSpan.textContent = date;
        dateLabel.appendChild(numSpan);

        dateLabel.style.gridRow = `${ctrRow}`;
        dateLabel.style.gridColumn = `${i + 1}`;
        mnth_cal.appendChild(dateLabel);
    }

    // 2. TANGGAL BULAN INI (Current Month)
    for (let i = 1; i <= daysInMonth; i++) {
        const dateLabel = document.createElement('div');
        dateLabel.classList.add('date_labels');

        const dayOfWeek = (firstDay + i - 1) % 7;
        if (dayOfWeek === 0) dateLabel.classList.add('date_labels_sunday');

        // A. Buat Span Angka
        const numSpan = document.createElement('span');
        numSpan.className = 'date-number';
        numSpan.textContent = i;
        dateLabel.appendChild(numSpan);

        // B. Buat Container Event
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'events-container';
        dateLabel.appendChild(eventsContainer);

        // C. Cek apakah ada jadwal di tanggal ini?
        const dateKey = `${year}-${month}-${i}`; // Key untuk cek data
        if (dataJadwal[dateKey]) {
            // Loop setiap event di hari itu
            dataJadwal[dateKey].forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = `event-item ${event.type}`; // misal: 'event-item joseph-bg'

                const eventTitle = document.createElement('span');
                eventTitle.className = 'event-title';
                eventTitle.textContent = event.title;

                const eventName = document.createElement('span');
                eventName.className = 'event-name';
                eventName.textContent = event.name;

                eventItem.appendChild(eventTitle);
                eventItem.appendChild(eventName);
                eventsContainer.appendChild(eventItem);
            });
        }

        dateLabel.style.gridRow = `${ctrRow}`;
        dateLabel.style.gridColumn = `${dayOfWeek + 1}`;

        if (isTodayMonthYear && i === todayDate.getDate()) {
            dateLabel.classList.add('today-date');
        }

        mnth_cal.appendChild(dateLabel);

        if (dayOfWeek === 6) {
            ctrRow++;
        }
    }

    // 3. TANGGAL BULAN DEPAN (Next Month)
    let nextMonthDate = 1;
    let finalDayOfWeek = (firstDay + daysInMonth - 1) % 7;
    let col = finalDayOfWeek + 2; // +1 karena index 0, +1 lagi untuk next col



    while (col <= 7) { // Batasi max row agar aman

        if (col === 1 && nextMonthDate > 7) break; // Berhenti jika sudah mengisi seminggu ke depan

        const dateLabel = document.createElement('div');
        dateLabel.classList.add('date_labels', 'date_labels_others');

        if (col === 1) dateLabel.classList.add('date_labels_sunday_others');

        const numSpan = document.createElement('span');
        numSpan.className = 'date-number';
        numSpan.textContent = nextMonthDate;
        dateLabel.appendChild(numSpan);

        dateLabel.style.gridRow = `${ctrRow}`;
        dateLabel.style.gridColumn = `${col}`;
        mnth_cal.appendChild(dateLabel);

        nextMonthDate++;
        col++;
    }
}

(function () {
    thisDay = new Date();
    thisYear = thisDay.getFullYear();
    thisMonth = thisDay.getMonth();

    let mnth_cal_container;
    let todoContainer;
    let labelTanggal;
    let eventsContainer;

    function handleCalendarClick(event) {
        const target = event.target;

        if (target.closest('button.prev')) {
            thisMonth--;
            if (thisMonth < 0) {
                thisMonth = 11;
                thisYear--;
            }
            generateMonthCalendar(thisYear, thisMonth);
            return;
        }

        if (target.closest('button.next')) {
            thisMonth++;
            if (thisMonth > 11) {
                thisMonth = 0;
                thisYear++;
            }
            generateMonthCalendar(thisYear, thisMonth);
            return;
        }

        if (target.closest('button.today')) {
            thisYear = thisDay.getFullYear();
            thisMonth = thisDay.getMonth();
            generateMonthCalendar(thisYear, thisMonth);
            return;
        }

    }

    function handleCalendarHover(event) {
        const target = event.target;

        if (target.matches('.week_labels')) {
            if (event.type === 'mouseover') {
                target.classList.add('hovered');
                const currentRow = target.dataset.weekRow;
                currentHoveredWeek = document.querySelectorAll(`div.date_labels[data-week-row="${currentRow}"]`);
                currentHoveredWeek.forEach(elem => elem.classList.add("selected_date_labels"));
            } else if (event.type === 'mouseout') {
                target.classList.remove('hovered');
                if (currentHoveredWeek) {
                    currentHoveredWeek.forEach(elem => elem.classList.remove("selected_date_labels"));
                    currentHoveredWeek = null;
                }
            }
            return;
        }

        if (target.matches('.date_labels:not(.date_labels_others)')) {
            if (event.type === 'mouseover') {
                target.classList.add('selected_date_labels');
            } else if (event.type === 'mouseout') {
                target.classList.remove('selected_date_labels');
            }
            return;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        mnth_cal_container = document.querySelector('div.month_calendar');
        todoContainer = document.querySelector('div.todoContainer');
        labelTanggal = document.querySelector('label[for="tanggal"]');
        formTodo = document.querySelector('form[name="todo"]');
        labelTodo = document.querySelector('label[for="todo"]');
        submitContainer = document.querySelector('#submitContainer');
        addButton = document.querySelector('input[type="button"]');

        generateMonthCalendar(thisYear, thisMonth);

        mnth_cal_container.addEventListener('click', handleCalendarClick);
        mnth_cal_container.addEventListener('mouseover', handleCalendarHover);
        mnth_cal_container.addEventListener('mouseout', handleCalendarHover);

    });

})();