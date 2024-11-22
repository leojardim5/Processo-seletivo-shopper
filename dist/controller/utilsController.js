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
const Schemas_1 = __importDefault(require("../model/Schemas"));
const utils = {
    validateRideRequest: ({ origin, destination, customerId, }) => {
        if (!origin.trim() || !destination.trim() || !customerId.trim()) {
            throw new Error("Origem, destino e ID do cliente não podem estar vazios.");
        }
        if (origin.trim() === destination.trim()) {
            throw new Error("Origem e destino não podem ser iguais.");
        }
    },
    findCoordinates: (address) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4`);
            const location = (_a = response.data.results[0]) === null || _a === void 0 ? void 0 : _a.geometry.location;
            if (!location) {
                throw new Error("Não foi possível obter as coordenadas para o endereço fornecido.");
            }
            return { latitude: location.lat, longitude: location.lng };
        }
        catch (error) {
            console.error("Erro ao buscar coordenadas:", error);
            throw new Error("Erro ao buscar coordenadas. Por favor, tente novamente.");
        }
    }),
    getAvailableDrivers: (distance) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const drivers = yield Schemas_1.default.Driver.find();
            if (!drivers.length)
                throw new Error("Nenhum motorista disponível no momento.");
            return drivers
                .filter((driver) => driver.minKm <= distance)
                .map((driver) => ({
                id: driver.id,
                name: driver.name,
                description: driver.description,
                vehicle: driver.vehicle,
                review: driver.review,
                price: Math.round(distance * driver.ratePerKm * 100) / 100,
            }));
        }
        catch (error) {
            console.error("Erro ao buscar motoristas:", error);
            throw new Error("Erro ao buscar motoristas. Tente novamente mais tarde.");
        }
    }),
    generateRideResponse: (apiResponse) => {
        const durationMinutes = Math.floor(parseInt(apiResponse.duration.replace(/s/g, "")) / 60);
        const distanceKm = apiResponse.distance / 1000;
        return {
            origin: apiResponse.origin,
            destination: apiResponse.destination,
            distance: distanceKm,
            duration: durationMinutes,
            options: [],
            routeDetails: apiResponse.routeDetails,
        };
    },
};
exports.default = utils;
