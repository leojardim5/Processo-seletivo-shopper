import express, {Request,Response} from 'express'
import funcaoControllers from '../controller/controller'

const routes = express()

routes.post('/', (req:Request,res:Response)=>funcaoControllers.upload(req,res))