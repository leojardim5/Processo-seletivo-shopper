import express, {Response,Request} from 'express'
import RequestBody from './requestInterface'
import validateRequestBody from './validate'
import findByCustomerCode from '../model/modelMockado'
import findDuplicates from '../model/modelMockado'


const funcaoControllers = {


    upload: async(req:Request,res:Response) =>{

        // integraçao com gemini pra ver se vai diz os numeros

        const {image,customer_code,measure_datetime,measure_type}:RequestBody = req.body

        const {value,error} = validateRequestBody(req.body)

        if(error){

            res.status(400).json({

                error_code: 'INVALID_DATA',
                error_description: error

            })

        }

       

        if( findDuplicates(req.body)){

            res.status(409).json({

                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada"

                })

        }

        res.status(200).json({

            // Aqui sao os dados retornado pela ia

        })

    }



}

export default funcaoControllers