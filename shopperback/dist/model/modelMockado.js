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
const motoristas = [
    {
        id: 1,
        nome: "Homer Simpson",
        descricao: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        carro: "Plymouth Valiant 1973 rosa e enferrujado",
        avaliacao: "2/5",
        comentario: "Motorista simpático,mas errou o caminho 3 vezes. O carro cheira a donuts.",
        taxaPorKm: 2.50,
        kmMinimo: 1
    },
    {
        id: 2,
        nome: "Dominic Toretto",
        descricao: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        carro: "Dodge Charger R/T 1970 modificado",
        avaliacao: "4/5",
        comentario: "Que viagem incrível! carro é um show à partee o motorista, apesar deter uma cara de poucos amigos, foi super gente boa. Recomendo!",
        taxaPorKm: 5.00,
        kmMinimo: 5
    },
    {
        id: 3,
        nome: "James Bond",
        descricao: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        carro: "Aston Martin DB5 clássico",
        comentario: "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico.Uma experiência digna de um agente secreto.",
        avaliacao: "5/5",
        taxaPorKm: 10,
        kmMinimo: 10
    }
];
const inserirMotoristas = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Limpa a coleção antes de inserir os motoristas
        yield Schemas_1.default.Driver.deleteMany({});
        console.log("Coleção de motoristas limpa.");
        // Insere os motoristas no banco
        yield Schemas_1.default.Driver.insertMany(motoristas);
        console.log("Motoristas inseridos com sucesso!");
    }
    catch (error) {
        console.error("Erro ao inserir motoristas:", error);
    }
});
exports.default = { motoristas, inserirMotoristas };
