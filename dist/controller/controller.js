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
const utilsController_1 = __importDefault(require("./utilsController"));
const funcaoControllers = {
    requestRide: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { customer_id, origin, destination } = req.body;
            console.log(origin);
            console.log(destination);
            console.log(customer_id);
            if (!origin || origin.trim() === "") {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O endereço de origem não pode estar vazio.",
                });
                return;
            }
            if (!destination || destination.trim() === "") {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O endereço de destino não pode estar vazio.",
                });
                return;
            }
            if (!customer_id || customer_id.trim() === "") {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O ID do usuário não pode estar vazio.",
                });
                return;
            }
            if (origin.trim() === destination.trim()) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Os endereços de origem e destino não podem ser os mesmos.",
                });
                return;
            }
            const { lat: originLat, lng: originLng } = yield utilsController_1.default.findCoordenadas(origin);
            const { lat: destinationLat, lng: destinationLng } = yield utilsController_1.default.findCoordenadas(destination);
            const response = yield axios_1.default.post(`https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`, {
                origin: {
                    location: {
                        latLng: {
                            latitude: originLat,
                            longitude: originLng,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: destinationLat,
                            longitude: destinationLng,
                        },
                    },
                },
            }, {
                headers: {
                    "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs",
                    "Content-Type": "application/json",
                },
            });
            const respostaFinal = {
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
                routeResponse: response.data,
            };
            console.log(yield utilsController_1.default.moldeDeRetornoCorrida(respostaFinal));
            res.status(200).json(yield utilsController_1.default.moldeDeRetornoCorrida(respostaFinal));
        }
        catch (error) {
            console.error("Erro desconhecido:", error);
            res.status(500).json({
                error_code: "GOOGLE_API_ERROR",
                error_description: "Ocorreu um erro desonhecido com o serviço."
            });
        }
    }),
    confirmRide: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
            if (!customer_id || !origin || !destination || !driver || !driver.id || !driver.name || !distance || !value) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Dados obrigatórios estão ausentes ou inválidos.",
                });
            }
            if (origin.trim() === destination.trim()) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Origem e destino não podem ser iguais.",
                });
            }
            // const motorista = await Driver.findOne({ id: driver.id, name: driver.name });
            // if (!motorista) {
            //     res.status(404).json({
            //         error_code: "DRIVER_NOT_FOUND",
            //         error_description: "O motorista informado não foi encontrado.",
            //     });
            // }
            // if (distance < motorista.minKm) {
            //     res.status(406).json({
            //         error_code: "INVALID_DISTANCE",
            //         error_description: `A distância informada (${distance} km) é menor que a mínima aceita pelo motorista (${motorista.minKm} km).`,
            //     });
            // }
            // const newRide = new Ride({
            //     customer_id,
            //     origin,
            //     destination,
            //     distance,
            //     duration,
            //     driver,
            //     value,
            // });
            // await newRide.save();
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error("Erro ao confirmar a viagem:", error);
            res.status(500).json({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: "Ocorreu um erro inesperado ao processar a solicitação.",
            });
        }
    }),
};
exports.default = funcaoControllers;
