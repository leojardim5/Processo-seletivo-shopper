export interface Review {
    rating: number; 
    comment: string;
  }
  
  export interface DriverOption {
    id: number;
    name: string;
    description: string; 
    vehicle: string; 
    review: Review; 
    price: number; 
  }
  
  export interface RideRequest {
    customerId: string; 
    origin: string; 
    destination: string; 
  }
  
  export interface RideResponse {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number }; 
    distance: number; 
    duration: number; 
    options: DriverOption[]; 
    routeDetails: object; 
  }
  
  export interface RoutesApiResponse {
    origin: { latitude: number; longitude: number }; 
    destination: { latitude: number; longitude: number };
    distance: number;
    duration: string; 
    routeDetails: object; 
  }