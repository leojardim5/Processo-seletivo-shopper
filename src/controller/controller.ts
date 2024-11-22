import { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from 'axios';
const apiKey = "AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4"
import utils from "./utilsController";
import { RoutesApiResponse } from "./interfacesController";


const funcaoControllers = {
    requestRide: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { customer_id, origin, destination } = req.body;

            const validacao = utils.validarDadosViagem(origin, destination, customer_id);

            if (!validacao.valid) {
                res.status(400).json(validacao.error);
                return;
            }

            const { lat: originLat, lng: originLng } = await utils.findCoordenadas(origin);
            const { lat: destinationLat, lng: destinationLng } = await utils.findCoordenadas(destination);


            const response = await axios.post(
                `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`,
                {
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
                },
                {
                    headers: {
                        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs",
                        "Content-Type": "application/json",
                    },
                }
            );



            const respostaFinal: RoutesApiResponse = {
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

            }

            res.status(200).json(await utils.moldeDeRetornoCorrida(respostaFinal))

        } catch (error) {
            console.error("Erro desconhecido:", error);
            res.status(500).json({
                error_code: "GOOGLE_API_ERROR",
                error_description: "Ocorreu um erro desonhecido com o serviço."
            });
        }

    },

    confirmRide: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        } catch (error) {
            console.error("Erro ao confirmar a viagem:", error);
            res.status(500).json({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: "Ocorreu um erro inesperado ao processar a solicitação.",
            });
        }
    },
}


export default funcaoControllers;
