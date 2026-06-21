import { useState } from 'react'
import { ArrowUpRight, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/Icon'
import { FileViewer } from '@/components/FileViewer'

export function ResourceCard({ resource }) {
  const [viewing, setViewing] = useState(false)
  const isFile = Boolean(resource.file)

  const cardContent = (
    <Card className="h-full p-5 transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon name={resource.icon} className="h-5 w-5" />
        </div>
        {isFile
          ? <FileText className="h-5 w-5 text-muted-foreground/50" />
          : <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
        }
      </div>
      <h3 className="font-semibold leading-tight">{resource.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {resource.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {resource.tags.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>
    </Card>
  )

  if (isFile) {
    return (
      <>
        <button
          className="group w-full text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
          onClick={() => setViewing(true)}
        >
          {cardContent}
        </button>
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

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {cardContent}
    </a>
  )
}
