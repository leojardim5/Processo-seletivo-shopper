import bp from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import routes from './routes/routes';

const server = express();


server.use(cors());
server.use(bp.urlencoded({extended:true}))

server.use(routes)

server.get('/', (req: Request, res: Response) => {
    res.send('Olá, mundo!');
});



server.listen(3030, () => {
    console.log('Servidor rodando na porta');
});


