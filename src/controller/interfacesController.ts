export interface Review {
    rating: number;
    comment: string;
}

export interface Option {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: Review;
    value: number |any;
}

export interface RideResponse {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    distance: number;
    duration: string | number;
    options: Option[];
    routeResponse: object;
}

export interface RoutesApiResponse {

    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    distance: number;
    duration: string;
    routeResponse: object;

}

export interface Motorista {
    id: number;
    nome: string;
    descricao: string;
    carro: string;
    avaliacao: Review;
    taxaPorKm: number,
    kmMinimo: number ,
    
}




