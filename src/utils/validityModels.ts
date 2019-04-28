import * as yup from 'yup'
export const passwordModel = yup.string().min(3).max(255).required()