"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const funcaoControllers = {
    upload: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        axios_1.default.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAvot91yFsr4Gkw9dJ4nAtILsJgnKVaAoQ', data, config)
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
        res.status(200).json();
        // Aqui sao os dados retornado})
    })
};
exports.default = funcaoControllers;
