export const getErrorMessage = (error, fallback = 'Something went wrong.') => {
  if (!error?.response) {
    return 'Something went wrong. Please try again.'
  }

  const fieldErrors = error.response?.data?.details?.fieldErrors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const firstError = Object.values(fieldErrors)
      .flat()
      .find((value) => typeof value === 'string' && value.trim())
    if (firstError) return firstError
  }

  const statusCode = Number(error.response?.status || 0)
  if (statusCode >= 500) {
    return 'Something went wrong. Please try again.'
  }

  return error.response?.data?.message || fallback || 'Something went wrong. Please try again.'
}
