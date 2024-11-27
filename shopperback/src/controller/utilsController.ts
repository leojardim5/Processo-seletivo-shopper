import axios, { AxiosResponse } from "axios";
import { RoutesApiFirstResponse, RideResponseWithDrivers, DriverOption, FirstRequestFromUser, ConfirmRideOptionRequest } from "./interfacesController";
import Schemas from "../model/Schemas";


const utils = {
  validateRideRequest: ({ origin, destination, customer_id }: FirstRequestFromUser) => {
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

  validateConfirmRideOptionRequest: async ({ customer_id, origin, destination, distance, driver }: ConfirmRideOptionRequest): Promise<{ isValid: boolean, statusCode: number, json: { error_code: string, error_description: string } }> => {
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
      console.log(customer_id, origin, destination, driver, distance)
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
      console.log(customer_id, origin, destination, driver, distance)
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

      const selectDriver = await Schemas.Driver.findOne({ id: Number(driver.id) })

      if (!selectDriver) {

        return {
          isValid: false,
          statusCode: 404,
          json: {
            error_code: "DRIVER_NOT_FOUND",
            error_description: "O motorista não foi encontrado no nosso banco de dados"

          }
        }
      }

    } catch (error) {

      return {
        isValid: false,
        statusCode: 400,
        json: {
          error_code: "INVALID_REQUEST",
          error_description: "Os campos customer_id, origin, destination e driver são obrigatórios." + error,
        },

      }
    }
    return { isValid: true, statusCode: 200, json: { error_code: "ok", error_description: "ok" } }
  },


  findCoordinates: async (address: string): Promise<{ latitude: number; longitude: number }> => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4`);

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
          minKM: driver.minKm,
          price: Math.round(distance * driver.ratePerKm * 100) / 100,
        }));

    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
      throw new Error("Erro ao buscar motoristas. Tente novamente mais tarde.");
    }
  },



  generateRideResponse: (apiResponse: RoutesApiFirstResponse): RideResponseWithDrivers => {
    const durationMinutes = Math.floor(parseInt(apiResponse.duration.replace(/s/g, "")) / 60)
    const distanceKm = apiResponse.distance / 1000

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

  validateGetRidesRequest: async (customer_id: string, driver_id?: string): Promise<{ isValid: boolean, statusCode: number, json: { error_code: string, error_description: string } }> => {

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
        const driverExists = await Schemas.Driver.findOne({ id: Number(driver_id) });
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
    } catch (error) {
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
  },

  generateRequestBodyEstimateRide: (customer_id: string, originLat: number, originLng: number, destinationLat: number, destinationLng: number, response: AxiosResponse<any, any>, origin: string, destination: string): RoutesApiFirstResponse => {

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
    }

  },
  
  getCurrentDateTime(): string {
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

export default utils;
