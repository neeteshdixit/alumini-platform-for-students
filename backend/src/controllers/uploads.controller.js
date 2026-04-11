import crypto from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { parseMultipartFiles } from '../utils/multipart.js'

const MAX_PDF_FILES = 10
const MAX_PDF_FILE_BYTES = 15 * 1024 * 1024
const MAX_PDF_REQUEST_BYTES = 50 * 1024 * 1024

const isPdfFile = (file) => {
  const originalName = String(file?.originalName || '')
  const mimeType = String(file?.mimeType || '').toLowerCase()

  return /\.pdf$/i.test(originalName) || mimeType === 'application/pdf' || mimeType.endsWith('/pdf')
}

const buildFileUrl = (req, relativePath) => {
  return `${req.protocol}://${req.get('host')}${relativePath}`
}

const savePdfFile = async ({ req, file }) => {
  const uploadDir = path.resolve(process.cwd(), 'uploads', 'pdfs')
  await mkdir(uploadDir, { recursive: true })

  const storageName = `${Date.now()}-${crypto.randomUUID()}.pdf`
  const storagePath = path.join(uploadDir, storageName)
  await writeFile(storagePath, file.buffer)

  const relativePath = `/uploads/pdfs/${storageName}`
  const url = buildFileUrl(req, relativePath)

  return {
    url,
    fileName: file.originalName,
    fileSize: file.size,
    fileType: 'pdf',
    mimeType: file.mimeType || 'application/pdf',
  }
}

export const uploadPdfFiles = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const files = await parseMultipartFiles(req, {
    maxBytes: MAX_PDF_REQUEST_BYTES,
  })

  if (!files.length) {
    throw new AppError('Please select at least one PDF file.', 400)
  }

  if (files.length > MAX_PDF_FILES) {
    throw new AppError(`You can upload up to ${MAX_PDF_FILES} PDF files at once.`, 400)
  }

  for (const file of files) {
    if (!isPdfFile(file)) {
      throw new AppError('Only PDF files allowed.', 400)
    }

    if (file.size > MAX_PDF_FILE_BYTES) {
      throw new AppError('PDF size must be 15MB or less.', 400)
    }
  }

  const uploaded = []
  for (const file of files) {
    uploaded.push(await savePdfFile({ req, file }))
  }

  return sendSuccess(res, {
    message: uploaded.length > 1 ? 'PDF files uploaded successfully.' : 'PDF uploaded successfully.',
    url: uploaded[0]?.url || null,
    urls: uploaded.map((item) => item.url),
    file: uploaded[0] || null,
    files: uploaded,
  })
})
