import { AppError } from './app-error.js'

const boundaryPattern = /boundary=(?:"([^"]+)"|([^;]+))/i

const readStreamBuffer = (stream, maxBytes) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0

    const cleanup = () => {
      stream.off('data', onData)
      stream.off('end', onEnd)
      stream.off('error', onError)
    }

    const onData = (chunk) => {
      total += chunk.length
      if (total > maxBytes) {
        cleanup()
        stream.destroy()
        reject(new AppError('Upload size is too large.', 413))
        return
      }

      chunks.push(chunk)
    }

    const onEnd = () => {
      cleanup()
      resolve(Buffer.concat(chunks))
    }

    const onError = (error) => {
      cleanup()
      reject(error)
    }

    stream.on('data', onData)
    stream.on('end', onEnd)
    stream.on('error', onError)
  })
}

const parseHeaders = (headerBlock) => {
  const headers = {}

  for (const line of String(headerBlock || '').split('\r\n')) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim().toLowerCase()
    const value = line.slice(separatorIndex + 1).trim()
    headers[key] = value
  }

  return headers
}

const parseDisposition = (value = '') => {
  const nameMatch = value.match(/name="([^"]+)"/i)
  const filenameMatch = value.match(/filename="([^"]*)"/i)

  return {
    fieldName: nameMatch?.[1] || '',
    fileName: filenameMatch?.[1] || '',
  }
}

export const parseMultipartFiles = async (req, { maxBytes = 25 * 1024 * 1024 } = {}) => {
  const contentType = String(req.headers['content-type'] || '')
  const boundaryMatch = contentType.match(boundaryPattern)

  if (!boundaryMatch) {
    throw new AppError('multipart/form-data boundary is required.', 400)
  }

  const boundary = boundaryMatch[1] || boundaryMatch[2]
  const rawBuffer = await readStreamBuffer(req, maxBytes)
  const rawParts = rawBuffer.toString('binary').split(`--${boundary}`)
  const files = []

  for (let rawPart of rawParts) {
    if (!rawPart) continue
    if (rawPart === '--' || rawPart === '--\r\n') break

    if (rawPart.startsWith('\r\n')) {
      rawPart = rawPart.slice(2)
    }

    if (!rawPart || rawPart.startsWith('--')) continue

    const headerEnd = rawPart.indexOf('\r\n\r\n')
    if (headerEnd === -1) continue

    const headerText = rawPart.slice(0, headerEnd)
    let contentText = rawPart.slice(headerEnd + 4)

    if (contentText.endsWith('\r\n')) {
      contentText = contentText.slice(0, -2)
    }

    const headers = parseHeaders(headerText)
    const disposition = parseDisposition(headers['content-disposition'])

    if (!disposition.fileName) {
      continue
    }

    const buffer = Buffer.from(contentText, 'binary')
    if (!buffer.length) {
      throw new AppError('Uploaded file is empty.', 400)
    }

    files.push({
      fieldName: disposition.fieldName || 'file',
      originalName: disposition.fileName,
      mimeType: String(headers['content-type'] || 'application/octet-stream').toLowerCase(),
      buffer,
      size: buffer.length,
    })
  }

  return files
}
