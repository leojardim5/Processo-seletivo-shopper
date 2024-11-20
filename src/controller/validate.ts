import z from 'zod'

const validate = z.object({
    image: z.string().refine((val) => Buffer.from(val, 'base64').toString('base64') === val, {
      message: 'image não esta no formato Base64',
    }),
    customer_code: z.string(),
    measure_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'measure_datetime não é uma data válida',
    }),
    measure_type: z.enum(['WATER', 'GAS']),
  });

  const validateRequestBody = (data: any) => {
    try {
      return { value: validate.parse(data), error: null };
    } catch (error: any) {
      return { value: null, error };
    }
  };
  

  export default validateRequestBody

