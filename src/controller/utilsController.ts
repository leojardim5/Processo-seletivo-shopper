import axios from "axios";
import { RoutesApiResponse, RideResponse, DriverOption } from "./interfacesController";
import Schemas from "../model/Schemas";

const utils = {
  validateRideRequest: ({
    origin,
    destination,
    customerId,
  }: {
    origin: string;
    destination: string;
    customerId: string;
  }): void => {
    if (!origin.trim() || !destination.trim() || !customerId.trim()) {
      throw new Error("Origem, destino e ID do cliente não podem estar vazios.");
    }

    if (origin.trim() === destination.trim()) {
      throw new Error("Origem e destino não podem ser iguais.");
    }
  },

  findCoordinates: async (address: string): Promise<{ latitude: number; longitude: number }> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4`
      );
      const location = response.data.results[0]?.geometry.location;
      if (!location) {
        throw new Error("Não foi possível obter as coordenadas para o endereço fornecido.");
      }
      return { latitude: location.lat, longitude: location.lng };
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      throw new Error("Erro ao buscar coordenadas. Por favor, tente novamente.");
    }
  },

  getAvailableDrivers: async (distance: number): Promise<DriverOption[]> => {
    try {
      const drivers = await Schemas.Driver.find();
      if (!drivers.length) throw new Error("Nenhum motorista disponível no momento.");

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
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
      throw new Error("Erro ao buscar motoristas. Tente novamente mais tarde.");
    }
  },

  generateRideResponse: (apiResponse: RoutesApiResponse): RideResponse => {
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

export default utils;
