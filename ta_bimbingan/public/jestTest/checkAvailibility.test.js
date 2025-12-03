import {jest} from '@jest/globals';

// Kita gunakan unstable_mockModule agar mock ter-load sebelum file asli
jest.unstable_mockModule('../../services/jadwalService.js', () => ({
    __esModule: true,
    getUnavailable: jest.fn()
}));

jest.unstable_mockModule('../../services/dosenService.js', () => ({
    __esModule: true,
    getDosen: jest.fn()
}));

// Karena kita pakai ESM, kita harus import mock dan controller
// SETELAH unstable_mockModule dijalankan. Jadi pakai await import.
const {getUnavailable} = await import('../../services/jadwalService.js');
const {getDosen} = await import('../../services/dosenService.js');
const {checkAvailability} = await import('../../controllers/jadwalController.js');

// --- BAGIAN 3: TEST SUITE (Sama seperti sebelumnya) ---
describe('Controller - Check Availability Logic', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup req & res
        req = {
            query: {},
            user: {id: '6182301015'}
        };
        res = {
            json: jest.fn()
        };
    });

    test('Harus mengembalikan jamAvailable dengan benar (Skenario Normal)', async () => {
        req.query = {date: '2025-11-20', pemb: '1'};

        getDosen.mockResolvedValue([
            {nik: 'D001', status: '1'},
            {nik: 'D002', status: '2'}
        ]);

        getUnavailable.mockResolvedValue(['08:00', '10:00']);

        await checkAvailability(req, res);

        expect(res.json).toHaveBeenCalled();
        const result = res.json.mock.calls[0][0];

        // Validasi
        expect(result.jamAvailable).not.toContain('08:00');
        expect(result.jamAvailable).not.toContain('10:00');
        expect(result.jamAvailable).toContain('07:00');
        expect(result.jamAvailable).toContain('16:00');
    });

    test('Harus return array kosong jika parameter date/pemb tidak ada', async () => {
        req.query = {date: ''};

        await checkAvailability(req, res);

        expect(res.json).toHaveBeenCalledWith({availableSlots: []});
    });

    test('Filter Dosen: Logika pemb != 3', async () => {
        req.query = {date: '2025-11-20', pemb: '1'};

        getDosen.mockResolvedValue([
            {nik: 'D001', status: '1'},
            {nik: 'D002', status: '2'}
        ]);
        getUnavailable.mockResolvedValue([]);
        await checkAvailability(req, res);
        const dosenArrayArg = getUnavailable.mock.calls[0][1];
        expect(dosenArrayArg).toContain('D001');
        expect(dosenArrayArg).not.toContain('D002');
    });
});