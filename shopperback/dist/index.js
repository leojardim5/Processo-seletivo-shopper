"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const modelConfig_1 = __importDefault(require("./model/modelConfig"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(express_1.default.json());
server.use(routes_1.default);
server.get('/', (req, res) => {
    res.send('Olá, mundo!');
});
server.listen(8080, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, modelConfig_1.default)();
        console.log(`Servidor rodando na porta 8080`);
    }
    catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
}));
