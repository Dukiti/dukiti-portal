import { ResourceCard } from '@/components/ResourceCard'

export function GroupedGrid({ items }) {
  // Tach items co group va khong co group
  const ungrouped = items.filter((r) => !r.group)
  const grouped   = items.filter((r) => r.group)

  // Gom theo group, giu thu tu xuat hien dau tien
  const groupOrder = []
  const groupMap   = {}
  for (const item of grouped) {
    if (!groupMap[item.group]) {
      groupOrder.push(item.group)
      groupMap[item.group] = []
    }
    groupMap[item.group].push(item)
  }

  return (
    <div className="space-y-10">
      {ungrouped.length > 0 && (
        <CardGrid items={ungrouped} />
      )}
      {groupOrder.map((group) => (
        <section key={group}>
          <h2 className="mb-4 text-base font-semibold text-muted-foreground tracking-wide uppercase">
            {group}
          </h2>
          <CardGrid items={groupMap[group]} />
        </section>
      ))}
    </div>
  )
}

function CardGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((r) => (
        <ResourceCard key={r.file ?? r.title} resource={r} />
      ))}
    </div>
  )
}
