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
const mongoose_1 = __importDefault(require("mongoose"));
const Schemas_1 = __importDefault(require("./Schemas"));
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = "mongodb+srv://leoJardim:Leojardim13@clus.nlffmt6.mongodb.net/rides?retryWrites=true&w=majority";
        yield mongoose_1.default.connect(mongoUri);
        console.log("Conectado ao MongoDB!");
    }
    catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
});
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDatabase();
        console.log("Conexão com MongoDB realizada com sucesso!");
        yield Promise.all([
            Schemas_1.default.Ride.createCollection(),
        ]);
    }
    catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        process.exit(1);
    }
});
exports.default = initializeDatabase;
