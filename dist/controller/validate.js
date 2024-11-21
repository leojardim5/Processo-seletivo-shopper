"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const validate = zod_1.default.object({
    image: zod_1.default.string().refine((val) => Buffer.from(val, 'base64').toString('base64') === val, {
        message: 'image não esta no formato Base64',
    }),
    customer_code: zod_1.default.string(),
    measure_datetime: zod_1.default.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'measure_datetime não é uma data válida',
    }),
    measure_type: zod_1.default.enum(['WATER', 'GAS']),
});
const validateRequestBody = (data) => {
    try {
        return { value: validate.parse(data), error: null };
    }
    catch (error) {
        return { value: null, error };
    }
};
exports.default = validateRequestBody;
