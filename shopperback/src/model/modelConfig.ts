import mongoose from "mongoose";
import dotenv from "dotenv";
import Schemas from "./Schemas";

dotenv.config(); // Carrega variáveis do .env

const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI; // Usa a variável de ambiente

        if (!mongoUri) {
            throw new Error("MONGO_URI não foi definida no arquivo .env");
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

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
            Schemas.Driver.createCollection(),
        ]);

    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        process.exit(1);
    }
};

export default initializeDatabase;
