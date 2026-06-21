// Cloudflare Worker — proxy GitHub API để ẩn token khỏi client.
// Deploy: https://dash.cloudflare.com → Workers → Create Worker → paste code này.
// Secret: Workers → Settings → Variables → Add variable: GH_TOKEN (encrypted).

const ALLOWED_ORIGIN = 'https://dukiti.github.io'

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, env)
    }
    if (request.method !== 'GET') {
      return corsResponse('Method Not Allowed', 405, env)
    }

    if (!env.GH_TOKEN) {
      return corsResponse('GH_TOKEN secret chưa được cấu hình.', 500, env)
    }

    try {
      const repos = await fetchAllRepos(env.GH_TOKEN)
      const mapped = repos
        .filter((r) => !r.fork && !r.archived)
        .map((r) => ({
          title: r.name,
          description: r.description || 'Không có mô tả.',
          url: r.html_url,
          category: 'repos',
          icon: 'Github',
          private: r.private,
          tags: [
            r.private ? 'private' : 'public',
            r.language,
            r.stargazers_count > 0 && `★ ${r.stargazers_count}`,
          ].filter(Boolean),
        }))

      return corsResponse(JSON.stringify(mapped), 200, env, 'application/json')
    } catch (err) {
      return corsResponse(err.message, 502, env)
    }
  },
}

async function fetchAllRepos(token) {
  const repos = []
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100&page=${page}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'dukiti-portal-worker',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const page_data = await res.json()
    repos.push(...page_data)
    if (page_data.length < 100) break
  }
  return repos
}

function corsResponse(body, status, env, contentType = 'text/plain') {
  // Khi dev local (origin không match) vẫn cho qua để test.
  const origin = ALLOWED_ORIGIN
  return new Response(body, {
    status,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-store',
    },
  })
}
