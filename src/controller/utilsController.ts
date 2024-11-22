import axios from "axios";
const apiKey = "AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4"
import { RideResponse, RoutesApiResponse,Motorista,Option, Review } from "./interfacesController";
import Schemas from "../model/Schemas";


const utils = {

    findCoordenadas: async (endereco : string) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`
            );
            const coordinates = response.data.results[0]?.geometry.location;
            if (!coordinates) {
                throw new Error("Não foi possível obter as coordenadas para o endereço fornecido.");
            }
            return coordinates;
        } catch (error) {
            console.error("Erro ao obter coordenadas:", error);
            throw error;
        }
        
    },
    
    retornarVetorMotoristas: async (distance: number): Promise<Option[]> => {
        const vetorCorrida: Option[] = [];
    
        try {
            const motoristas:Motorista[] = await Schemas.Driver.find();
    
            if (!motoristas || motoristas.length === 0) {
                throw new Error("Nenhum motorista encontrado.");
            }
    
            motoristas
                .filter((motorista) => motorista.kmMinimo <= distance)
                .forEach((motoristaFiltrado) => {
                    const corridaInterface: Option = {
                        id: motoristaFiltrado.id,
                        name: motoristaFiltrado.nome,
                        description: motoristaFiltrado.descricao,
                        vehicle: motoristaFiltrado.carro,
                        review: {
                            comment: motoristaFiltrado.avaliacao.comment,
                            rating: motoristaFiltrado.avaliacao.rating,
                        },
                        value: Math.round(distance * motoristaFiltrado.taxaPorKm * 100) / 100,
                    };
    
                    vetorCorrida.push(corridaInterface);
                });
                
    
            return vetorCorrida;
        } catch (error) {
            console.error("Erro ao buscar motoristas:", error);
            throw error;
        }
    },
    moldeDeRetornoCorrida:async (info : RoutesApiResponse)=>{
        console.log(info.duration)

        const tempoDeCorridaMinutos = Math.floor(parseInt(info.duration.replace(/s/g, "")) / 60);

        const distanciaDeCorridaKM = info.distance / 1000

        const infoDaCorridaRequisitada:RideResponse = {

            origin: info.origin,
            destination: info.destination,
            duration: tempoDeCorridaMinutos,
            distance: distanciaDeCorridaKM,
            options: await utils.retornarVetorMotoristas(distanciaDeCorridaKM),
            routeResponse:info.routeResponse,

        }
       

        return infoDaCorridaRequisitada


    },
    validarDadosViagem: (origin: string,destination: string,customer_id: string): { valid: boolean; error?: { error_code: string; error_description: string } } => {
        
        if (!origin || origin.trim() === "") {
            return {
                valid: false,
                error: {
                    error_code: "INVALID_DATA",
                    error_description: "O endereço de origem não pode estar vazio.",
                },
            };
        }
        if (!destination || destination.trim() === "") {
            return {
                valid: false,
                error: {
                    error_code: "INVALID_DATA",
                    error_description: "O endereço de destino não pode estar vazio.",
                },
            };
        }
        if (!customer_id || customer_id.trim() === "") {
            return {
                valid: false,
                error: {
                    error_code: "INVALID_DATA",
                    error_description: "O ID do usuário não pode estar vazio.",
                },
            };
        }
        if (origin.trim() === destination.trim()) {
            return {
                valid: false,
                error: {
                    error_code: "INVALID_DATA",
                    error_description: "Os endereços de origem e destino não podem ser os mesmos.",
                },
            };
        }
        return { valid: true };
    },
};
    


export default utils

