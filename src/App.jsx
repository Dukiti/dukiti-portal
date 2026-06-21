import { useMemo, useState } from 'react'
import { Search, FolderSearch } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Sidebar } from '@/components/Sidebar'
import { ResourceCard } from '@/components/ResourceCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Icon } from '@/components/Icon'
import { resources, categories, profile } from '@/data/resources'
import { useGithubRepos } from '@/lib/useGithubRepos'

export default function App() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('all')

  // Nạp repo public từ GitHub và gộp vào danh sách tài nguyên tĩnh.
  const { repos: githubRepos, loading: reposLoading, error: reposError } =
    useGithubRepos(profile.githubUser)

  const allResources = useMemo(
    () => [...resources, ...githubRepos],
    [githubRepos],
  )

  // Đếm số tài nguyên cho mỗi danh mục (hiển thị ở sidebar).
  const counts = useMemo(() => {
    const c = { all: allResources.length }
    for (const cat of categories) {
      if (cat.id === 'all') continue
      c[cat.id] = allResources.filter((r) => r.category === cat.id).length
    }
    return c
  }, [allResources])

  // Lọc theo danh mục + tìm kiếm (tên, mô tả, tag).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allResources.filter((r) => {
      const matchCat = active === 'all' || r.category === active
      if (!matchCat) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [query, active, allResources])

  // Mục Repositories phụ thuộc vào dữ liệu GitHub -> hiển thị trạng thái nạp/lỗi.
  const showRepoStatus = active === 'repos' || active === 'all'

  const activeLabel =
    categories.find((c) => c.id === active)?.label ?? 'Tất cả'

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} onSelect={setActive} counts={counts} />

      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center gap-3 px-5 py-4 md:px-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm tài nguyên theo tên hoặc tag…"
                className="pl-9"
              />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="px-5 py-8 md:px-8">
          {/* Bộ lọc danh mục cho mobile (sidebar bị ẩn) */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={
                  'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ' +
                  (active === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground')
                }
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{activeLabel}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} tài nguyên
              {query && ` khớp với “${query}”`}
            </p>
            {showRepoStatus && reposLoading && (
              <p className="mt-1 text-sm text-muted-foreground">
                Đang nạp repo từ GitHub…
              </p>
            )}
            {showRepoStatus && reposError && (
              <p className="mt-1 text-sm text-destructive">
                Không nạp được repo GitHub: {reposError}
              </p>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((r) => (
                <ResourceCard key={r.title} resource={r} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <FolderSearch className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 font-medium">Không tìm thấy tài nguyên nào</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Thử từ khóa khác hoặc đổi danh mục.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
