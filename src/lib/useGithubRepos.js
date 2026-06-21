import { useEffect, useState } from 'react'

// Fetch danh sách public repo của một user GitHub và chuyển sang dạng
// "resource" để dùng chung với ResourceCard.
// API: https://api.github.com/users/<user>/repos (không cần token cho public).
export function useGithubRepos(user) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetch(
      `https://api.github.com/users/${user}/repos?sort=updated&per_page=100`,
      { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const mapped = data
          .filter((r) => !r.fork)
          .map((r) => ({
            title: r.name,
            description: r.description || 'Không có mô tả.',
            url: r.html_url,
            category: 'repos',
            icon: 'Github',
            tags: [
              r.language,
              r.stargazers_count > 0 && `★ ${r.stargazers_count}`,
            ].filter(Boolean),
          }))
        setRepos(mapped)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [user])

  return { repos, loading, error }
}
