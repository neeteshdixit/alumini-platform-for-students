import { AppError } from '../utils/app-error.js'

export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body)

  if (!parsed.success) {
    return next(new AppError('Validation failed.', 400, parsed.error.flatten()))
  }

  req.body = parsed.data
  return next()
}
