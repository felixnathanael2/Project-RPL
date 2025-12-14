import { jest } from '@jest/globals';

await jest.unstable_mockModule("../services/bimbinganService.js", () => ({
    createPengajuan: jest.fn(),
}));

const bimbinganController = await import("../controllers/bimbinganController.js");
const bimbinganService = await import("../services/bimbinganService.js");

describe("Controller Pengajuan Bimbingan", () => {

    let req, res;

    // Reset req dan res sebelum tiap tes
    beforeEach(() => {
        req = {
            body: {
                tanggal: "2025-12-18",
                waktu: "10:00",
                lokasiId: 11,
                nik: ["20250001", "20250002"]
            },
            user: { id: "6182301055" }
        };

        res = {
            status: jest.fn().mockReturnThis(), // untuk dapetin res.status().json()
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    it("Controller Harus mengembalikan mengembalikan json 'Pengajuan berhasil'", async () => {
        // anggep service nya tidak ada masalah di create pengajuan
        bimbinganService.createPengajuan.mockResolvedValue(true);

        await bimbinganController.ajukanBimbingan(req, res);

        //mirip assert di jUnit
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Pengajuan berhasil"
        }));
    });

    //test untuk cek apakah kalau seandainya bagian repositorynya yang bermasalah 
    it("Harus mengembalikan status 500 jika Service error", async () => {
        bimbinganService.createPengajuan.mockRejectedValue(new Error("DB Mati"));

        await bimbinganController.ajukanBimbingan(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining("Gagal")
        }));
    });

    //testing kalo misal ada kolom yang kosong tidak diisi
    it("Harus mengembalikan status 400 jika data tidak lengkap (Validasi)", async () => {

        req.body.tanggal = "";
        //coba panggil controller
        await bimbinganController.ajukanBimbingan(req, res);
        //harusnya sih hasilnya 400
        expect(res.status).toHaveBeenCalledWith(400);

        // controller harusnya kriim pesan error 
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining("Data tidak lengkap")
        }));
        //pastiin service ga dipanggil saolnya controllernya udah ngembaliin 400
        expect(bimbinganService.createPengajuan).not.toHaveBeenCalled();
    });
});