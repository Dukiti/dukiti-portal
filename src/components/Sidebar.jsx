import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'
import { profile, categories } from '@/data/resources'

export function Sidebar({ active, onSelect, counts }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 p-5 md:flex">
      <a
        href={'https://github.com/' + profile.githubUser}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 flex items-center gap-2.5 group"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity group-hover:opacity-80">
          <Icon name="Github" className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Dukiti Portal</span>
      </a>

      <nav className="flex flex-col gap-1">
        {categories.map((cat) => {
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon name={cat.icon} className="h-4 w-4" />
                {cat.label}
              </span>
              <span
                className={cn(
                  'font-mono text-xs',
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/70'
                )}
              >
                {counts[cat.id] ?? 0}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-lg border border-border p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
          {profile.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{profile.name}</p>
          <p className="truncate text-xs text-muted-foreground">{profile.role}</p>
        </div>
      </div>
    </aside>
  )
}
