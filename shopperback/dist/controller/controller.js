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
const Schemas_1 = __importDefault(require("../model/Schemas"));
const rideController = {
    estimateRide: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { origin, destination, customer_id } = req.body;
            const validation = utilsController_1.default.validateRideRequest({ origin, destination, customer_id });
            if (!validation.isValid) {
                res.status(400).json(validation.json);
            }
            const { latitude: originLat, longitude: originLng } = yield utilsController_1.default.findCoordinates(origin);
            const { latitude: destinationLat, longitude: destinationLng } = yield utilsController_1.default.findCoordinates(destination);
            const response = yield axios_1.default.post(`https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`, {
                origin: {
                    location: {
                        latLng: {
                            latitude: originLat, longitude: originLng,
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
            const respostaFinalParaGerarUmaRequisicaoDeCorrida = utilsController_1.default.generateRequestBodyEstimateRide(customer_id, originLat, originLng, destinationLat, destinationLng, response, origin, destination);
            const rideResponse = utilsController_1.default.generateRideResponse(respostaFinalParaGerarUmaRequisicaoDeCorrida);
            rideResponse.options = yield utilsController_1.default.getAvailableDrivers(rideResponse.distance);
            res.status(200).json(rideResponse);
        }
        catch (error) {
            console.error("Erro ao estimar corrida:", error);
            res.status(400).json({ error: error });
        }
    }),
    confirmRide: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { customer_id, origin, destination, distance, driver } = req.body;
            req.body.date = utilsController_1.default.getCurrentDateTime();
            const validation = yield utilsController_1.default.validateConfirmRideOptionRequest({ origin, destination, customer_id, distance, driver });
            if (!validation.isValid) {
                res.status(validation.statusCode).json(validation.json);
                return;
            }
            const ride = new Schemas_1.default.Ride(req.body);
            yield ride.save();
            res.status(200).json({
                success: true,
            });
        }
        catch (error) {
            console.error("Erro ao confirmar corrida:", error);
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: error || "Os dados fornecidos são inválidos.",
            });
        }
    }),
    getAllRides: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { customer_id } = req.params;
        const driver_id = req.query.driver_id;
        const validation = utilsController_1.default.validateGetRidesRequest(customer_id, driver_id);
        if (!(yield validation).isValid) {
            res.status((yield validation).statusCode).json((yield validation).json);
            return;
        }
        try {
            const filtro = { customer_id };
            if (driver_id) {
                const driverExists = yield Schemas_1.default.Driver.findOne({ id: Number(driver_id) });
                if (!driverExists) {
                    res.status(400).json({
                        error_code: "INVALID_DRIVER",
                        error_description: "O ID do motorista informado não é válido.",
                    });
                }
                filtro["driver.id"] = driver_id;
            }
            const rides = yield Schemas_1.default.Ride.find(filtro).sort({ date: -1 });
            res.status(200).json({
                customer_id,
                rides: rides.flatMap((ride) => ({
                    id: ride._id,
                    date: ride.date,
                    origin: ride.origin,
                    destination: ride.destination,
                    distance: ride.distance,
                    duration: ride.duration,
                    driver: ride.driver,
                    value: ride.value,
                })),
            });
        }
        catch (error) {
            console.error("Erro ao buscar registros:", error);
            res.status(500).json({
                error_code: "INTERNAL_ERROR",
                error_description: "Erro interno ao buscar registros. Tente novamente.",
            });
        }
    })
};
exports.default = rideController;
