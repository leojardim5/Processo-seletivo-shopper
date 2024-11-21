import express, { Response, Request } from 'express'
import RequestBody from './requestInterface'
import validateRequestBody from './validate'
import findByCustomerCode from '../model/modelMockado'
import findDuplicates from '../model/modelMockado'
import axios from 'axios'


const funcaoControllers = {


    upload: async (req: Request, res: Response) => {
       
        const data = {
            contents: [
                {
                    parts: [
                        {
                            text: req.body.mensagem
                        }
                    ]
                }
            ]
        };

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAvot91yFsr4Gkw9dJ4nAtILsJgnKVaAoQ', data, config)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });


        // const { image, customer_code, measure_datetime, measure_type }: RequestBody = req.body

        // const { value, error } = validateRequestBody(req.body)

        // if (error) {

        //     res.status(400).json({

        //         error_code: 'INVALID_DATA',
        //         error_description: error

        //     })

        // }



        // if (findDuplicates(req.body)) {

        //     res.status(409).json({

        //         error_code: "DOUBLE_REPORT",
        //         error_description: "Leitura do mês já realizada"

        //     })

        // }

        res.status(200).json()

            // Aqui sao os dados retornado})

    }



}

export default funcaoControllers