import mongoose from "mongoose";
import Schemas from "./Schemas";

const connectDatabase = async () => {
    try {
        
        const mongoUri = "mongodb+srv://leoJardim:Leojardim13@clus.nlffmt6.mongodb.net/rides?retryWrites=true&w=majority";

        await mongoose.connect(mongoUri)

        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
};

const initializeDatabase = async () => {
    try {
        await connectDatabase();
        console.log("Conexão com MongoDB realizada com sucesso!");

        
        await Promise.all([
            Schemas.Ride.createCollection(), 
            Schemas.Driver.createCollection()
        ]);
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        process.exit(1);
    }
};

export default initializeDatabase;
