import express, {Request,Response,NextFunction} from 'express'
import funcaoControllers from '../controller/controller'

const routes = express()

routes.post('/ride/estimate', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.requestRide(req,res,next))

routes.patch('/ride/confirm', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.confirmRide(req,res,next))

export default routes