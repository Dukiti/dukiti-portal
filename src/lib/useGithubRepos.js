import { useEffect, useState } from 'react'

// Fetch repo từ Cloudflare Worker proxy (token ẩn phía server).
// URL proxy cấu hình qua VITE_REPOS_PROXY_URL trong .env.local / GitHub Secrets.
const PROXY_URL = import.meta.env.VITE_REPOS_PROXY_URL

export function useGithubRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(Boolean(PROXY_URL))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!PROXY_URL) return

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(PROXY_URL, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Proxy ${r.status}`)
        return r.json()
      })
      .then(setRepos)
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message) })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  return { repos, loading, error }
}
