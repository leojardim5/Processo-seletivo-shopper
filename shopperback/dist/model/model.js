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
const Schemas_1 = __importDefault(require("./Schemas"));
const drivers = [
    {
        id: 1,
        name: "Homer Simpson",
        description: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
        review: {
            rating: 2,
            comment: "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
        },
        ratePerKm: 2.5,
        minKm: 1,
    },
    {
        id: 2,
        name: "Dominic Toretto",
        description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        vehicle: "Dodge Charger R/T 1970 modificado",
        review: {
            rating: 4,
            comment: "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
        },
        ratePerKm: 5.0,
        minKm: 5,
    },
    {
        id: 3,
        name: "James Bond",
        description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        vehicle: "Aston Martin DB5 clássico",
        review: {
            rating: 5,
            comment: "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
        },
        ratePerKm: 10.0,
        minKm: 10,
    },
];
const insertDriversToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Schemas_1.default.Driver.insertMany(drivers);
        console.log("Motoristas inseridos com sucesso:", result);
    }
    catch (error) {
        console.error("Erro ao inserir motoristas no banco de dados:", error);
    }
});
exports.default = insertDriversToDatabase;
