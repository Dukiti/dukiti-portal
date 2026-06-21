import { useEffect, useState } from 'react'
import { X, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FileViewer({ file, title, onClose }) {
  const [content, setContent] = useState(null)
  const [error, setError] = useState(null)

  const href = import.meta.env.BASE_URL + file

  useEffect(() => {
    fetch(href)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(setContent)
      .catch((e) => setError(e.message))
  }, [href])

  // Đóng khi bấm Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative flex flex-col w-full max-w-3xl max-h-[80vh] rounded-lg border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 shrink-0">
          <span className="font-mono text-sm font-semibold truncate">{title}</span>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" asChild aria-label="Tải về">
              <a href={href} download="">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Đóng">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1 p-5">
          {!content && !error && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải…
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive">Không tải được file: {error}</p>
          )}
          {content && (
            <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words text-foreground">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
