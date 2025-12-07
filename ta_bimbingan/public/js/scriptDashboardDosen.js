let globalDataJadwal = {};

//memanggil api backend untuk ditampilkan ke frontend (yg bentuknya kalender)
async function fetchJadwalBimbingan() {
    try {
        const response = await fetch('/api/jadwal-bimbingan-dosen');
        const rawData = await response.json();

        globalDataJadwal = {};

        rawData.forEach(item => {
            const jamDisplay = item.waktu.substring(0, 5);

            //untuk warna bisa ditambah random ato mau gini aja juga gpp
            let colorType = "green-bg";
            if (parseInt(jamDisplay.substring(0, 2)) >= 12) {
                colorType = "blue-bg";
            }

            if (!globalDataJadwal[item.tanggal]) {
                globalDataJadwal[item.tanggal] = [];
            }

            globalDataJadwal[item.tanggal].push({
                title: jamDisplay,
                name: item.nama_mahasiswa,
                type: colorType
            });
        });

        //panggil di scriptCalendar.js untuk render kalender 
        updateCalendarHeader();
        generateCalendarGrid(currentYear, currentMonth, globalDataJadwal);

    } catch (error) {
        console.error("Gagal mengambil jadwal kalender:", error);
    }
}

//memanggil api dari backend untuk menampilkan ke frontend untuk stat di kanan
async function fetchStatistik() {
    try {
        //panggil ke routes untuk membantu fetching
        const response = await fetch('/api/dashboard-dosen-stats');
        const data = await response.json();

        console.log("Data Statistik Dosen:", data);

        if (data) {
            //masukin bedasarkan id htmlnya 
            document.getElementById('stat-permintaan').textContent = data.total_permintaan || 0;
            document.getElementById('stat-bimbingan').textContent = data.total_bimbingan || 0;
            document.getElementById('stat-mahasiswa').textContent = data.total_mahasiswa || 0;
            document.getElementById('stat-layak').textContent = data.layak_sidang || "0 / 0";
        }

    } catch (error) {
        console.error("Gagal mengambil statistik:", error);
        
        document.getElementById('stat-permintaan').textContent = "-";
        document.getElementById('stat-bimbingan').textContent = "-";
        document.getElementById('stat-mahasiswa').textContent = "-";
        document.getElementById('stat-layak').textContent = "-";

    }
}
async function fetchJadwalMingguan() {
    try {
        const response = await fetch('/api/my-schedule');
        const result = await response.json();

        let formattedJadwal = [];
        const colors = ['bg-teal', 'bg-pink', 'bg-blue-dark', 'bg-red', 'bg-orange', 'bg-olive', 'bg-purple'];

        if (result.status === 'success' && Array.isArray(result.data)) {
            formattedJadwal = result.data.map(item => ({
                day: item.hari,
                time: item.jam_mulai.substring(0, 5),
                end: item.jam_akhir.substring(0, 5),
                title: "Jadwal Kuliah",
                room: "R. Kuliah",
                color: colors[Math.floor(Math.random() * colors.length)]
            }));
        }

        renderSchedule(formattedJadwal);

    } catch (error) {
        console.error("Gagal mengambil jadwal mingguan:", error);
    }
}

async function fetchTodayBimbingan() {
    try {
        const response = await fetch('/api/jadwal-bimbingan-today');
        const data = await response.json();

        const container = document.getElementById('list-today');
        if (!container) return;

        container.innerHTML = ''; //bersihkan dummy atau data sebelumnya

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div>
                    Tidak ada jadwal bimbingan hari ini.
                </div>
            `;
            return;
        }


        data.forEach(item => {
            // ambil format waktu untuk jam dan menit saja (detik ga perlu)
            const jam = item.waktu ? item.waktu.substring(0, 5) : "-";
            const ruangan = item.nama_ruangan || "Lokasi Belum ditentukan";

            //tambahin item satu satu dah
            const htmlItem = `
                <div class="bimbingan-line">
                    <div class="dot"></div>
                    <p><b>${item.nama_mahasiswa}</b> — ${jam} (${ruangan})</p>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', htmlItem);
        });

    } catch (error) {
        console.error("Gagal fetch hari ini:", error);
        const container = document.getElementById('list-today');
        if (container) container.innerHTML = '<p style="color:red">Gagal memuat data.</p>';
    }
}

document.addEventListener("DOMContentLoaded", () => {

    fetchStatistik();
    fetchJadwalBimbingan();
    fetchJadwalMingguan();
    fetchTodayBimbingan();
    const viewToggle = document.getElementById('viewToggle');
    const monthlyView = document.querySelector('.kalender-bulanan');
    const rightHeader = document.querySelector('#right-header');
    const weeklyView = document.querySelector('.kalender-mingguan');

    if (monthlyView) monthlyView.classList.remove('hidden');
    if (rightHeader) rightHeader.classList.remove('hidden');
    if (weeklyView) weeklyView.classList.add('hidden');

    if (viewToggle && monthlyView && weeklyView) {
        viewToggle.addEventListener('change', function () {
            if (this.checked) { // Switch ke Mingguan
                monthlyView.classList.add('hidden');
                rightHeader.classList.add('hidden');
                weeklyView.classList.remove('hidden');
            } else { // Switch ke Bulanan
                monthlyView.classList.remove('hidden');
                rightHeader.classList.remove('hidden');
                weeklyView.classList.add('hidden');
            }
        });
    }

    // C. Navigation Logic (Next/Prev Month)
    const btnNext = document.querySelector('.ri-arrow-right-s-line');
    const btnPrev = document.querySelector('.ri-arrow-left-s-line');

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }

            // Update UI dengan fungsi dari scriptCalender.js
            updateCalendarHeader();
            generateCalendarGrid(currentYear, currentMonth, globalDataJadwal);
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }

            // Update UI dengan fungsi dari scriptCalender.js
            updateCalendarHeader();
            generateCalendarGrid(currentYear, currentMonth, globalDataJadwal);
        });
    }
});