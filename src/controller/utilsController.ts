import axios from "axios";
const apiKey = "AIzaSyCJdmA2JhQzA-beqlITN1hK8no5g6nV_m4"
import { RideResponse, RoutesApiResponse,Motorista,Option, Review } from "./interfacesController";
import motoristas from "../model/modelMockado";


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
    
    retornarVetorMotoristas:(distance:number)=>{

        const vetorCorrida:Option[] = []



        motoristas.filter(motorista=> motorista.kmMinimo <= distance).map(motoristaFiltrado=>{

           
            const corridaInterface: Option = {

                id:motoristaFiltrado.id,
                name:motoristaFiltrado.nome,
                description:motoristaFiltrado.descricao,
                vehicle:motoristaFiltrado.carro,
                review:{comment:motoristaFiltrado.comentario,rating:parseInt(motoristaFiltrado.avaliacao)},
                value: Math.round((distance * motoristaFiltrado.taxaPorKm) * 100) / 100
            } 

            
            vetorCorrida.push(corridaInterface)


        })

        return vetorCorrida;

    } ,
    moldeDeRetornoCorrida:(info : RoutesApiResponse)=>{
        console.log(info.duration)

        const tempoDeCorridaMinutos = Math.floor(parseInt(info.duration.replace(/s/g, "")) / 60);

        const distanciaDeCorridaKM = info.distance / 1000

        const infoDaCorridaRequisitada:RideResponse = {

            origin: info.origin,
            destination: info.destination,
            duration: tempoDeCorridaMinutos,
            distance: distanciaDeCorridaKM,
            options:utils.retornarVetorMotoristas(distanciaDeCorridaKM),
            routeResponse:info.routeResponse,

        }

        return infoDaCorridaRequisitada


    },



}

export default utils

