"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testUploads = [
    {
        image: 'dGVzdGltYWdl', // Base64 válida
        customer_code: 'CUST001',
        measure_datetime: '2024-11-19T12:00:00Z', // ISO 8601 válida
        measure_type: 'WATER', // Valor válido
        description: 'Caso válido: Leitura de WATER para CUST001',
    },
    {
        image: 'dGVzdGltYWdl', // Base64 válida
        customer_code: 'CUST002',
        measure_datetime: '2024-11-19T12:00:00Z',
        measure_type: 'GAS', // Valor válido
        description: 'Caso válido: Leitura de GAS para CUST002',
    },
    {
        image: 'notbase64', // Base64 inválida
        customer_code: 'CUST003',
        measure_datetime: '2024-11-19T12:00:00Z',
        measure_type: 'WATER',
        description: 'Erro: Base64 inválida para CUST003',
    },
    {
        image: 'dGVzdGltYWdl',
        customer_code: 'CUST004',
        measure_datetime: 'invalid-date', // Data inválida
        measure_type: 'WATER',
        description: 'Erro: Data inválida para CUST004',
    },
    {
        image: 'dGVzdGltYWdl',
        customer_code: '', // Código do cliente vazio
        measure_datetime: '2024-11-19T12:00:00Z',
        measure_type: 'WATER',
        description: 'Erro: Código do cliente vazio',
    },
    {
        image: 'dGVzdGltYWdl',
        customer_code: 'CUST005',
        measure_datetime: '2024-11-19T12:00:00Z',
        measure_type: 'INVALID', // Tipo de leitura inválido
        description: 'Erro: Tipo de leitura inválido para CUST005',
    },
    {
        image: 'dGVzdGltYWdl',
        customer_code: 'CUST001', // Mesmo código e tipo de leitura que o primeiro caso
        measure_datetime: '2024-11-01T12:00:00Z', // Data no mesmo mês
        measure_type: 'WATER',
        description: 'Erro: Leitura duplicada no mesmo mês para CUST001',
    },
];
const findDuplicates = (billToFind) => {
    const results = testUploads.filter((upload) => upload.customer_code === billToFind.customer_code);
    if (results.find((result) => result.measure_datetime === billToFind.measure_datetime)) {
        return true;
    }
    return false;
};
const addToDB = (billToAdd) => {
    testUploads.push(billToAdd);
};
exports.default = findDuplicates;
