export const sendSuccess = (res, payload = {}, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, ...payload })
}

export const sendError = (res, message, statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  })
}
