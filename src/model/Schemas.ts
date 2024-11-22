import mongoose, { Schema} from "mongoose";



const RideSchema: Schema = new Schema({
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
});

const DriverSchema: Schema = new Schema({
    id: { type: Number, required: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    carro: { type: String, required: true },
    comentario: { type: String, required: true },
    avaliacao: { type: String, required: true },
    taxaPorKm: { type: Number, required: true },
    kmMinimo: { type: Number, required: true },
});


const Driver = mongoose.model("Driver", DriverSchema);



const Ride = mongoose.model("Ride", RideSchema);

export default {Ride,Driver};
