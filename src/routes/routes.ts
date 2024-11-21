import express, {Request,Response,NextFunction} from 'express'
import funcaoControllers from '../controller/controller'

const routes = express()

routes.post('/ride', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.requestRide(req,res,next))

export default routes