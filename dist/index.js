"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const server = (0, express_1.default)();
// Middleware para habilitar CORS
server.use((0, cors_1.default)());
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(routes_1.default);
// Rota principal com tipagem de Request e Response
server.get('/', (req, res) => {
    res.send('Olá, mundo!');
});
// Inicia o servidor na porta 3000
server.listen(3030, () => {
    console.log('Servidor rodando na porta 3030');
});
