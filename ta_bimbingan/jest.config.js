export default {
    // Gunakan jsdom untuk simulasi browser
    testEnvironment: 'jsdom',
    // Supaya output di terminal lebih detail
    verbose: true,
    transform: {},
    // Abaikan folder node_modules
    testPathIgnorePatterns: ['/node_modules/'],
};