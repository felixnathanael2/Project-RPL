import * as adminRepo from "../repository/adminRepo.js";

export async function getAllUsers() {
    return await adminRepo.getAllUsers();
}

export const createNewUser = async (data) => {
    //set default value kalau undefined
    const roleInt = data.role || 1; 
    const defaultPassword = "pass123";

    const userData = {
        //data untuk dosen maupun mahasiswa
        id_users: data.id_users, 
        email: data.email,
        nama: data.nama,
        password: defaultPassword,
        role: roleInt,

        //data khusus mahasiswa
        semester: data.semester,
        topik: data.topik,
        jenis_ta: data.jenis_ta,
        dosen1: data.dosen1,
        dosen2: data.dosen2
    };

    return await adminRepo.insertUser(userData);
};