export interface EstimateRequest {
    customer_id: string;
    origin: string;
    destination: string;
  }
  
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
    price: number;
  }
  
  export interface RideResponseFromUserRequest {
    customer_id:string,
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    distance: number;
    duration: string ;
    options: Option[];
    routeResponse: object;
    originString:string;
    destinationString:string;
  }

  export interface FinalRideResponse  {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string; 
    driver: { id: number; name: string };
    value: number;
  }

  export interface Ride {
    id: string;
    date: string; 
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: Option;
    value: number;
  }

  export interface RidesArray {
     
    customer_id:string,
    rides:Ride[]

  }
  