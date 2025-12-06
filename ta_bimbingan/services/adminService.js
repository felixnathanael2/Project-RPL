import * as adminRepo from "../repository/adminRepo.js";

export async function getAllUsers() {
    return await adminRepo.getAllUsers();
}

export const createNewUser = async (data) => {
    // casting role ke int
    let roleInt = 1; 
    if (data.roleString === "Dosen") roleInt = 2;
    if (data.roleString === "Admin") roleInt = 3;

    //sementara sih pake ginian, kalo mau pake UUID biar ga bisa diotak atik
    const defaultPassword = "password123"; 

    const newId = Date.now().toString().slice(-8);

    const userData = {
        email: data.email,
        nama: data.nama,
        password: defaultPassword, // Di real app harus di-hash (bcrypt)
        role: roleInt,
        
        topik: data.topik,
        dosen1: data.dosen1,
        dosen2: data.dosen2
    };

    return await adminRepo.insertUser(userData);
};