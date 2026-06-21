import { useState } from 'react'
import { ArrowUpRight, Download, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { FileViewer } from '@/components/FileViewer'

export function ResourceCard({ resource }) {
  const [viewing, setViewing] = useState(false)
  const isDownload = Boolean(resource.file)
  const href = isDownload
    ? import.meta.env.BASE_URL + resource.file
    : resource.url

  return (
    <>
      <Card className="flex flex-col h-full p-5 transition-all hover:border-primary/40 hover:shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon name={resource.icon} className="h-5 w-5" />
          </div>
          {isDownload ? (
            <a href={href} download="" aria-label="Tải về">
              <Download className="h-5 w-5 text-muted-foreground/50 transition-colors hover:text-primary" />
            </a>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Mở link">
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 transition-colors hover:text-primary" />
            </a>
          )}
        </div>

        <h3 className="font-semibold leading-tight">{resource.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground flex-1">
          {resource.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        {isDownload && (
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewing(true)}>
              <Eye className="h-4 w-4" />
              Xem
            </Button>
            <Button variant="default" size="sm" className="flex-1" asChild>
              <a href={href} download="">
                <Download className="h-4 w-4" />
                Tải về
              </a>
            </Button>
          </div>
        )}
      </Card>

      {viewing && (
        <FileViewer
          file={resource.file}
          title={resource.title}
          onClose={() => setViewing(false)}
        />
      )}
    </>
  )
}
