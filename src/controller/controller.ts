import { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from 'axios';
const apiKey = "AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4"
import utils from "./utilsController";
import {RoutesApiResponse } from "./interfacesController";


const funcaoControllers = {
    requestRide: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { customer_id, origin, destination } = req.body;

            if (!origin || origin.trim() === "") {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O endereço de origem não pode estar vazio.",
                });
                return
            }
            if (!destination || destination.trim() === "") {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O endereço de destino não pode estar vazio.",
                });
                return
            }
            if (!customer_id || customer_id.trim() === "") {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "O ID do usuário não pode estar vazio.",
                });
                return
            }
            if (origin.trim() === destination.trim()) {
                res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Os endereços de origem e destino não podem ser os mesmos.",
                });
                return
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
                routeResponse:response.data,
                
            }

            
            res.status(200).json(utils.moldeDeRetornoCorrida(respostaFinal))

        } catch (error) {
            console.error("Erro desconhecido:", error);
            res.status(500).json({
                error_code: "GOOGLE_API_ERROR",
                error_description: "Ocorreu um erro desonhecido com o serviço."
            });
        }

    }
}


export default funcaoControllers;
