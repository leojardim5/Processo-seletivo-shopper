import bp from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import routes from './routes/routes';
import initializeDatabase from './model/modelConfig';


const server = express();


server.use(cors());
server.use(bp.urlencoded({extended:true}))
server.use(express.json())
server.use(routes)

server.get('/', (req: Request, res: Response) => {
    res.send('Olá, mundo!');
});

server.listen(8080, async () => {
    try {
        await initializeDatabase(); 
        console.log(`Servidor rodando na porta 8080`);
    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
});





