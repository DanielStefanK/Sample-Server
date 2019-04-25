import { ValidationError } from "yup";

export const formatYupError = (err: ValidationError): Array<{ path: string; message: string }> => {
  const errors: Array<{ path: string; message: string }> = []
  err.inner.forEach((inner) => {
    errors.push({
      path: inner.path,
      message: inner.message
    })
  })
  return errors
}