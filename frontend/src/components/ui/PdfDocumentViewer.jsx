import { useMemo } from 'react'

import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'

function PdfDocumentViewer({
  fileUrl,
  fileName,
  className = '',
  contentClassName = '',
  showHeader = true,
}) {
  const layoutPlugin = useMemo(() => defaultLayoutPlugin(), [])

  if (!fileUrl) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        PDF not available.
      </div>
    )
  }

  const fallback = (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-semibold text-slate-700">
        Preview unavailable. Download the file instead.
      </p>
      <a
        className="inline-flex rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white"
        download={fileName || 'document.pdf'}
        href={fileUrl}
      >
        Download PDF
      </a>
    </div>
  )

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`.trim()}>
      {showHeader && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">{fileName || 'PDF file'}</p>
            <a
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              download={fileName || 'document.pdf'}
              href={fileUrl}
            >
              Download
            </a>
          </div>
        </div>
      )}
      <div className={`bg-slate-100 ${contentClassName || (showHeader ? 'h-[480px]' : 'h-full')}`.trim()}>
        <Worker workerUrl={pdfWorkerUrl}>
          <Viewer fileUrl={fileUrl} plugins={[layoutPlugin]} renderError={() => fallback} />
        </Worker>
      </div>
    </div>
  )
}

export default PdfDocumentViewer
