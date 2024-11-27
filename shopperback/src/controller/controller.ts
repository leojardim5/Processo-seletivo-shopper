import { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from 'axios';
import utils from "./utilsController";
import { RideResponseWithDrivers, RoutesApiFirstResponse, RideInterface } from "./interfacesController";
import Schemas from "../model/Schemas";
const apiKey = process.env.GOOGLE_API_KEY;




const rideController = {
    estimateRide: async (req: Request, res: Response): Promise<void> => {
        try {
            const { origin, destination, customer_id } = req.body;

            const validation = utils.validateRideRequest({ origin, destination, customer_id });

            if (!validation.isValid) {
                res.status(400).json(validation.json)
            }

            const { latitude: originLat, longitude: originLng } = await utils.findCoordinates(origin);
            const { latitude: destinationLat, longitude: destinationLng } = await utils.findCoordinates(destination);


            const response = await axios.post(
                `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`, {
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
            },
                {
                    headers: {
                        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs",
                        "Content-Type": "application/json",
                    },
                }
            );

            const respostaFinalParaGerarUmaRequisicaoDeCorrida = utils.generateRequestBodyEstimateRide(customer_id, originLat, originLng, destinationLat, destinationLng, response, origin, destination)


            const rideResponse: RideResponseWithDrivers = utils.generateRideResponse(respostaFinalParaGerarUmaRequisicaoDeCorrida);
            rideResponse.options = await utils.getAvailableDrivers(rideResponse.distance);


            res.status(200).json(rideResponse);
        } catch (error) {
            console.error("Erro ao estimar corrida:", error);
            res.status(400).json({ error: error });
        }
    },

    confirmRide: async (req: Request, res: Response): Promise<void> => {
        try {
            const { customer_id, origin, destination, distance, driver } = req.body;
            req.body.date = utils.getCurrentDateTime()

            const validation = await utils.validateConfirmRideOptionRequest({ origin, destination, customer_id, distance, driver });
            
           
            if (!validation.isValid) {
                res.status(validation.statusCode).json(validation.json)
                return
            }
            
            const ride = new Schemas.Ride(req.body);
            await ride.save();
            

            res.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error("Erro ao confirmar corrida:", error);

            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: error || "Os dados fornecidos são inválidos.",
            });
        }
    },
    getAllRides: async (req: Request, res: Response): Promise<void> => {

        const { customer_id } = req.params;
        const driver_id = req.query.driver_id;

        const validation = utils.validateGetRidesRequest(customer_id, driver_id as string)

        if (!(await validation).isValid) {
            res.status((await validation).statusCode).json((await validation).json)
            return
        }


        try {
            const filtro: any = { customer_id };

            if (driver_id) {
                const driverExists = await Schemas.Driver.findOne({ id: Number(driver_id) });
                if (!driverExists) {
                    res.status(400).json({
                        error_code: "INVALID_DRIVER",
                        error_description: "O ID do motorista informado não é válido.",
                    });
                }
                filtro["driver.id"] = driver_id;
            }

            const rides = await Schemas.Ride.find(filtro).sort({ date: -1 });

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

        } catch(error) {
        console.error("Erro ao buscar registros:", error);
        res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "Erro interno ao buscar registros. Tente novamente.",
        });
    }


}



}


export default rideController;
