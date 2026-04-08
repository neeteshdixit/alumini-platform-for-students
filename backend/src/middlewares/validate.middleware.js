import { AppError } from '../utils/app-error.js'

export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body)

  if (!parsed.success) {
    const firstIssueMessage = parsed.error.issues?.[0]?.message || 'Validation failed.'
    return next(new AppError(firstIssueMessage, 400, parsed.error.flatten()))
  }

  req.body = parsed.data
  return next()
}
