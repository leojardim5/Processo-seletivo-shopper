export interface Review {
    rating: number; 
    comment: string;
  }

  export interface FirstRequestFromUser{
    origin:string,
    destination:string,
    customer_id:string
  }
  
  export interface DriverOption {
    id: number;
    name: string;
    description: string; 
    vehicle: string; 
    review: Review; 
    price: number; 
    minKM:number
  }

  export interface ConfirmRideOptionRequest{
    customer_id:string, 
    origin:string, 
    destination:string, 
    distance:string, 
    driver:DriverOption
  }
  
  export interface RideResponseWithDrivers {
    customer_id:string,
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number }; 
    distance: number; 
    duration: number; 
    options: DriverOption[]; 
    routeDetails: object; 
    originString:string,
    destinationString:string,
  }
  
  
  export interface RoutesApiFirstResponse {
    customer_id:string,
    origin: { latitude: number; longitude: number }; 
    destination: { latitude: number; longitude: number };
    distance: number;
    duration: string; 
    routeDetails: object; 
    originString:string;
    destinationString:string;
  }

  export interface RideInterface{
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: { id: number; name: string };
    value: number,
    date: Date
  }
  