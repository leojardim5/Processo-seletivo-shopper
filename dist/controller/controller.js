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
            const { origin, destination, customerId } = req.body;
            utilsController_1.default.validateRideRequest({ origin, destination, customerId });
            const originCoords = yield utilsController_1.default.findCoordinates(origin);
            const destinationCoords = yield utilsController_1.default.findCoordinates(destination);
            const apiResponse = yield axios_1.default.post(`https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4`, {
                origin: { location: { latLng: originCoords } },
                destination: { location: { latLng: destinationCoords } },
            }, { headers: { "Content-Type": "application/json" } });
            const rideResponse = utilsController_1.default.generateRideResponse(apiResponse.data);
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
            const { customerId, origin, destination, distance, driver } = req.body;
            utilsController_1.default.validateRideRequest({ origin, destination, customerId });
            const selectedDriver = yield Schemas_1.default.Driver.findOne({ id: driver.id });
            if (!selectedDriver) {
                throw new Error("Motorista não encontrado.");
            }
            if (distance < selectedDriver.minKm) {
                throw new Error("Distância inválida para o motorista selecionado.");
            }
            const ride = new Schemas_1.default.Ride(req.body);
            yield ride.save();
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error("Erro ao confirmar corrida:", error);
            res.status(400).json({ error: error });
        }
    }),
};
exports.default = rideController;
