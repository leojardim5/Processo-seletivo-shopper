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
    validateRideRequest: ({ origin, destination, customer_id }) => {
        if (!origin || !destination) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "INVALID_ADDRESS",
                    error_description: "Os endereços de origem e destino não podem estar em branco.",
                },
            };
        }
        if (!customer_id) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "INVALID_CUSTOMER_ID",
                    error_description: "O ID do usuário não pode estar em branco.",
                },
            };
        }
        if (origin === destination) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "SAME_ADDRESS",
                    error_description: "Os endereços de origem e destino não podem ser o mesmo.",
                },
            };
        }
        return { isValid: true };
    },
    validateConfirmRideOptionRequest: (_a) => __awaiter(void 0, [_a], void 0, function* ({ customer_id, origin, destination, distance, driver }) {
        if (!customer_id || !origin || !destination || !driver) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "INVALID_REQUEST",
                    error_description: "Os campos customer_id, origin, destination e driver são obrigatórios.",
                },
            };
        }
        if (origin === destination) {
            console.log(customer_id, origin, destination, driver, distance);
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "SAME_ADDRESS",
                    error_description: "Os endereços de origem e destino não podem ser o mesmo.",
                },
            };
        }
        if (parseFloat(distance) < driver.minKM) {
            console.log(customer_id, origin, destination, driver, distance);
            return {
                isValid: false,
                statusCode: 406,
                json: {
                    error_code: "INVALID_DISTANCE",
                    error_description: "A distância invalida para o motorista.",
                },
            };
        }
        try {
            const selectDriver = yield Schemas_1.default.Driver.findOne({ id: Number(driver.id) });
            if (!selectDriver) {
                return {
                    isValid: false,
                    statusCode: 404,
                    json: {
                        error_code: "DRIVER_NOT_FOUND",
                        error_description: "O motorista não foi encontrado no nosso banco de dados"
                    }
                };
            }
        }
        catch (error) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "INVALID_REQUEST",
                    error_description: "Os campos customer_id, origin, destination e driver são obrigatórios." + error,
                },
            };
        }
        return { isValid: true, statusCode: 200, json: { error_code: "ok", error_description: "ok" } };
    }),
    findCoordinates: (address) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4`);
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
                minKM: driver.minKm,
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
            customer_id: apiResponse.customer_id,
            origin: apiResponse.origin,
            destination: apiResponse.destination,
            distance: distanceKm,
            duration: durationMinutes,
            options: [],
            routeDetails: apiResponse.routeDetails,
            originString: apiResponse.originString,
            destinationString: apiResponse.destinationString
        };
    },
    validateGetRidesRequest: (customer_id, driver_id) => __awaiter(void 0, void 0, void 0, function* () {
        if (!customer_id) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "INVALID_DATA",
                    error_description: "O ID do cliente não pode estar em branco.",
                },
            };
        }
        if (driver_id && isNaN(Number(driver_id))) {
            return {
                isValid: false,
                statusCode: 400,
                json: {
                    error_code: "INVALID_DRIVER",
                    error_description: "O ID do motorista deve ser um número válido.",
                },
            };
        }
        try {
            if (driver_id) {
                const driverExists = yield Schemas_1.default.Driver.findOne({ id: Number(driver_id) });
                if (!driverExists) {
                    return {
                        isValid: false,
                        statusCode: 400,
                        json: {
                            error_code: "INVALID_DRIVER",
                            error_description: "O ID do motorista informado não é válido.",
                        },
                    };
                }
            }
            return {
                isValid: true,
                statusCode: 200,
                json: {
                    error_code: "OK",
                    error_description: "Validação bem-sucedida.",
                },
            };
        }
        catch (error) {
            console.error("Erro ao validar driver_id:", error);
            return {
                isValid: false,
                statusCode: 500,
                json: {
                    error_code: "INTERNAL_ERROR",
                    error_description: "Erro interno ao validar driver_id. Tente novamente.",
                },
            };
        }
    }),
    generateRequestBodyEstimateRide: (customer_id, originLat, originLng, destinationLat, destinationLng, response, origin, destination) => {
        return {
            customer_id,
            origin: {
                latitude: originLat,
                longitude: originLng,
            },
            destination: {
                latitude: destinationLat,
                longitude: destinationLng,
            },
            distance: response.data.routes[0].distanceMeters,
            duration: response.data.routes[0].duration,
            routeDetails: response.data,
            originString: origin,
            destinationString: destination
        };
    },
    getCurrentDateTime() {
        const now = new Date();
        return now.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }
};
exports.default = utils;
