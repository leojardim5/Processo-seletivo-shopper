import { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from 'axios';
const apiKey = "AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4"
import utils from "./utilsController";
import { RoutesApiResponse } from "./interfacesController";
import Schemas from "../model/Schemas";


const rideController = {
  estimateRide: async (req: Request, res: Response): Promise<void> => {
    try {
      const { origin, destination, customerId } = req.body;

      utils.validateRideRequest({ origin, destination, customerId });

      const originCoords = await utils.findCoordinates(origin);
      const destinationCoords = await utils.findCoordinates(destination);

      const apiResponse = await axios.post(
        `https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4`,
        {
          origin: { location: { latLng: originCoords } },
          destination: { location: { latLng: destinationCoords } },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const rideResponse = utils.generateRideResponse(apiResponse.data);
      rideResponse.options = await utils.getAvailableDrivers(rideResponse.distance);

      res.status(200).json(rideResponse);
    } catch (error) {
      console.error("Erro ao estimar corrida:", error);
      res.status(400).json({ error: error });
    }
  },

  confirmRide: async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId, origin, destination, distance, driver } = req.body;

      utils.validateRideRequest({ origin, destination, customerId });

      const selectedDriver = await Schemas.Driver.findOne({ id: driver.id });
      if (!selectedDriver) {
        throw new Error("Motorista não encontrado.");
      }

      if (distance < selectedDriver.minKm) {
        throw new Error("Distância inválida para o motorista selecionado.");
      }

      const ride = new Schemas.Ride(req.body);
      await ride.save();

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erro ao confirmar corrida:", error);
      res.status(400).json({ error: error });
    }
  },
};

export default rideController;
