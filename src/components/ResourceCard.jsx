import { ArrowUpRight, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/Icon'

export function ResourceCard({ resource }) {
  // `file` = đường dẫn trong public/ (vd 'scripts/backup.sh') -> tải về.
  // `url`  = link ngoài -> mở tab mới.
  const isDownload = Boolean(resource.file)
  const href = isDownload
    ? import.meta.env.BASE_URL + resource.file
    : resource.url

  // Thuộc tính riêng theo loại: tải file (cùng origin) vs mở link ngoài.
  const linkProps = isDownload
    ? { href, download: '' }
    : { href, target: '_blank', rel: 'noopener noreferrer' }

  const CornerIcon = isDownload ? Download : ArrowUpRight

  return (
    <a
      {...linkProps}
      className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full p-5 transition-all hover:border-primary/40 hover:shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon name={resource.icon} className="h-5 w-5" />
          </div>
          <CornerIcon className="h-5 w-5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
        </div>

        <h3 className="font-semibold leading-tight">{resource.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {resource.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </a>
  )
}
