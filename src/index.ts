import bp from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

const server = express();


// Middleware para habilitar CORS
server.use(cors());
server.use(bp.urlencoded({extended:true}))

// Rota principal com tipagem de Request e Response
server.get('/', (req: Request, res: Response) => {
    res.send('Olá, mundo!');
});

// Inicia o servidor na porta 3000
server.listen(3030, () => {
    console.log('Servidor rodando na porta 3030');
});
