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
const axios_1 = __importDefault(require("axios"));
const apiKey = "AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4";
const modelMockado_1 = __importDefault(require("../model/modelMockado"));
const utils = {
    findCoordenadas: (endereco) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`);
            const coordinates = (_a = response.data.results[0]) === null || _a === void 0 ? void 0 : _a.geometry.location;
            if (!coordinates) {
                throw new Error("Não foi possível obter as coordenadas para o endereço fornecido.");
            }
            return coordinates;
        }
        catch (error) {
            console.error("Erro ao obter coordenadas:", error);
            throw error;
        }
    }),
    retornarVetorMotoristas: (distance) => {
        const vetorCorrida = [];
        modelMockado_1.default.filter(motorista => motorista.kmMinimo <= distance).map(motoristaFiltrado => {
            const corridaInterface = {
                id: motoristaFiltrado.id,
                name: motoristaFiltrado.nome,
                description: motoristaFiltrado.descricao,
                vehicle: motoristaFiltrado.carro,
                review: { comment: motoristaFiltrado.comentario, rating: parseInt(motoristaFiltrado.avaliacao) },
                value: Math.round((distance * motoristaFiltrado.taxaPorKm) * 100) / 100
            };
            vetorCorrida.push(corridaInterface);
        });
        return vetorCorrida;
    },
    moldeDeRetornoCorrida: (info) => {
        console.log(info.duration);
        const tempoDeCorridaMinutos = Math.floor(parseInt(info.duration.replace(/s/g, "")) / 60);
        const distanciaDeCorridaKM = info.distance / 1000;
        const infoDaCorridaRequisitada = {
            origin: info.origin,
            destination: info.destination,
            duration: tempoDeCorridaMinutos,
            distance: distanciaDeCorridaKM,
            options: utils.retornarVetorMotoristas(distanciaDeCorridaKM),
            routeResponse: info.routeResponse,
        };
        return infoDaCorridaRequisitada;
    },
};
exports.default = utils;