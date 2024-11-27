import express, {Request,Response,NextFunction} from 'express'
import funcaoControllers from '../controller/controller'


const routes = express()

routes.post('/ride/estimate', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.estimateRide(req,res))

routes.patch('/ride/confirm', (req:Request,res:Response, next:NextFunction)=>funcaoControllers.confirmRide(req,res))

routes.get('/ride/:customer_id',(req:Request,res:Response, next:NextFunction)=>funcaoControllers.getAllRides(req,res))



  


export default routes