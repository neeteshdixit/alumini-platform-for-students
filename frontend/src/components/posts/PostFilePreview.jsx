import { useMemo, useState } from 'react'

const inferFileTypeFromUrl = (url) => {
  const normalized = String(url || '').trim().toLowerCase()

  if (normalized.endsWith('.pdf')) {
    return 'pdf'
  }

  if (/\.(png|jpe?g|webp|gif|bmp|svg)(\?|#|$)/i.test(normalized)) {
    return 'image'
  }

  return 'file'
}

const formatBytes = (value) => {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes < 0) {
    return 'Size not available'
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['KB', 'MB', 'GB', 'TB']
  let scaled = bytes / 1024
  let unitIndex = 0

  while (scaled >= 1024 && unitIndex < units.length - 1) {
    scaled /= 1024
    unitIndex += 1
  }

  return `${scaled.toFixed(scaled >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

const getFileNameFromUrl = (url) => {
  if (!url) return 'File'

  try {
    const resolved = new URL(url, window.location.origin)
    return decodeURIComponent(resolved.pathname.split('/').filter(Boolean).pop() || 'File')
  } catch {
    return decodeURIComponent(String(url).split('/').filter(Boolean).pop() || 'File')
  }
}

const normalizeFile = (file) => {
  if (typeof file === 'string') {
    const url = file.trim()
    return {
      url,
      fileType: inferFileTypeFromUrl(url),
      fileName: getFileNameFromUrl(url),
      fileSize: null,
      mimeType: null,
    }
  }

  const url = String(file?.url || file?.fileUrl || '').trim()
  const fileType = String(file?.fileType || inferFileTypeFromUrl(url)).trim().toLowerCase() || 'file'
  const fileName = String(file?.fileName || '').trim() || getFileNameFromUrl(url)
  const fileSize = Number.isFinite(Number(file?.fileSize)) ? Number(file.fileSize) : null

  return {
    url,
    fileType,
    fileName,
    fileSize,
    mimeType: file?.mimeType || null,
  }
}

function PostFilePreview({ compact = false, file, onRemove }) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  const normalized = useMemo(() => normalizeFile(file), [file])
  const isPdf = normalized.fileType === 'pdf'
  const isImage = normalized.fileType === 'image'
  const previewHeightClass = compact ? 'h-48' : 'h-[420px]'
  const fileLabel = isPdf ? 'PDF' : isImage ? 'Image' : 'File'
  const openButtonLabel = isPdf ? 'View PDF' : isImage ? 'View Image' : 'View File'

  if (!normalized.url) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        File not available right now
      </div>
    )
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="min-w-0 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-sm font-black text-red-700">
              {fileLabel}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{normalized.fileName}</p>
              <p className="text-xs text-slate-500">
                {fileLabel}
                {normalized.fileSize !== null && normalized.fileSize !== undefined
                  ? `  |  ${formatBytes(normalized.fileSize)}`
                  : ''}
                {normalized.mimeType ? `  |  ${normalized.mimeType}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              download={normalized.fileName || 'file'}
              href={normalized.url}
            >
              Download
            </a>
            <button
              className="rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800"
              onClick={() => setIsFullscreenOpen(true)}
              type="button"
            >
              {openButtonLabel}
            </button>
            {onRemove && (
              <button
                className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                onClick={() => onRemove(normalized.url)}
                type="button"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className={`${previewHeightClass} bg-slate-100`}>
          {isPdf ? (
            <iframe
              className="h-full w-full border-0"
              loading="lazy"
              src={normalized.url}
              title={normalized.fileName}
            />
          ) : isImage ? (
            <img
              alt={normalized.fileName}
              className="h-full w-full object-contain"
              src={normalized.url}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500">
              Preview not available for this file type.
            </div>
          )}
        </div>
      </article>

      {isFullscreenOpen && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box w-11/12 max-w-6xl p-0">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-blue-950">{normalized.fileName}</h3>
                <p className="text-xs text-slate-500">
                  {fileLabel}
                  {normalized.fileSize !== null && normalized.fileSize !== undefined
                    ? `  |  ${formatBytes(normalized.fileSize)}`
                    : ''}
                </p>
              </div>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
                onClick={() => setIsFullscreenOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="h-[80vh] bg-slate-100">
              {isPdf ? (
                <iframe
                  className="h-full w-full border-0"
                  loading="lazy"
                  src={normalized.url}
                  title={`${normalized.fileName} full screen`}
                />
              ) : isImage ? (
                <img
                  alt={`${normalized.fileName} full screen`}
                  className="h-full w-full object-contain"
                  src={normalized.url}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500">
                  File preview is not available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PostFilePreview


