import mongoose, { Schema } from "mongoose";



interface Ride extends Document {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: { id: number; name: string };
  value: number,
  date: string
}

const RideSchema: Schema<Ride> = new Schema({
  customer_id: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true },
  duration: { type: String, required: true },
  driver: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  value: { type: Number, required: true },
  date:{ type:String}})


  interface Driver{
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: { rating: number; comment: string };
  ratePerKm: number;
  minKm: number;
}

const DriverSchema: Schema<Driver> = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  vehicle: { type: String, required: true },
  review: {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  ratePerKm: { type: Number, required: true },
  minKm: { type: Number, required: true },
});

const Driver = mongoose.model<Driver>("Driver", DriverSchema);

const Ride = mongoose.model("Ride", RideSchema);

export default { Ride, Driver };
