// Chạy lúc BUILD (trong GitHub Actions) để lấy repo của bạn — gồm cả private —
// rồi ghi ra src/data/github-repos.json để app đóng gói sẵn.
//
// Token được đọc từ biến môi trường GH_REPOS_TOKEN (lưu trong GitHub Secrets),
// KHÔNG bao giờ lọt vào bundle phía client.
//
// Không có token (ví dụ chạy local) -> ghi mảng rỗng, không làm hỏng build.

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = fileURLToPath(new URL('../src/data/github-repos.json', import.meta.url))
const token = process.env.GH_REPOS_TOKEN

async function fetchAllRepos() {
  const repos = []
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100&page=${page}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
    const page_data = await res.json()
    repos.push(...page_data)
    if (page_data.length < 100) break
  }
  return repos
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true })

  if (!token) {
    console.warn('[fetch-repos] Không có GH_REPOS_TOKEN -> ghi mảng rỗng.')
    await writeFile(OUT, '[]\n')
    return
  }

  const raw = await fetchAllRepos()
  const repos = raw
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

  await writeFile(OUT, JSON.stringify(repos, null, 2) + '\n')
  console.log(`[fetch-repos] Đã ghi ${repos.length} repo vào src/data/github-repos.json`)
}

main().catch((err) => {
  console.error('[fetch-repos] Lỗi:', err.message)
  process.exit(1)
})
