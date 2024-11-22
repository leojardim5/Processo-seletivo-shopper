import express, {Request,Response,NextFunction} from 'express'
import funcaoControllers from '../controller/controller'


const routes = express()

routes.post('/ride/estimate', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.estimateRide(req,res))

routes.patch('/ride/confirm', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.confirmRide(req,res))



  


export default routes