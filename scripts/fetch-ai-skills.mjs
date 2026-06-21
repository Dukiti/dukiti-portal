// Fetch tat ca file trong repo Dukiti/ai-agent (private) luc BUILD.
// - Noi dung file -> public/ai-skills/  (FileViewer fetch truc tiep)
// - Metadata      -> src/data/ai-skills.json  (import vao AI tab)
//
// Token doc tu GH_REPOS_TOKEN (GitHub Secrets), khong lo ra client.
// Khong co token -> ghi mang rong, khong pha build.

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT       = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_DIR = join(ROOT, 'public', 'ai-skills')
const META_OUT   = join(ROOT, 'src', 'data', 'ai-skills.json')
const REPO       = 'Dukiti/ai-agent'
const token      = process.env.GH_REPOS_TOKEN

const SKIP_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.zip'])

function ghFetch(path) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

function iconForFile(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['md', 'txt'].includes(ext)) return 'FileText'
  if (['json', 'yaml', 'yml', 'toml'].includes(ext)) return 'Braces'
  if (['sh', 'bash'].includes(ext)) return 'FileTerminal'
  if (['py'].includes(ext)) return 'FileCode'
  return 'Bot'
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true })

  if (!token) {
    console.warn('[fetch-ai-skills] Khong co GH_REPOS_TOKEN -> ghi mang rong.')
    await writeFile(META_OUT, '[]\n')
    return
  }

  // Lay danh sach tat ca file qua Git Tree API (recursive)
  const treeRes = await ghFetch('git/trees/HEAD?recursive=1')
  if (treeRes.status === 409) {
    console.warn('[fetch-ai-skills] Repo chua co commit -> ghi mang rong.')
    await writeFile(META_OUT, '[]\n')
    return
  }
  if (!treeRes.ok) throw new Error(`Tree API ${treeRes.status}: ${await treeRes.text()}`)
  const { tree } = await treeRes.json()

  const files = tree.filter((node) => {
    if (node.type !== 'blob') return false
    const ext = '.' + node.path.split('.').pop().toLowerCase()
    return !SKIP_EXTENSIONS.has(ext)
  })

  console.log(`[fetch-ai-skills] Tim thay ${files.length} file trong ${REPO}`)

  const skills = []

  for (const file of files) {
    const contentRes = await ghFetch(`contents/${file.path}`)
    if (!contentRes.ok) {
      console.warn(`  Bỏ qua ${file.path}: ${contentRes.status}`)
      continue
    }
    const data = await contentRes.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')

    // Luu file vao public/ai-skills/
    const localPath = join(PUBLIC_DIR, file.path)
    await mkdir(dirname(localPath), { recursive: true })
    await writeFile(localPath, content)

    const fileName = file.path.split('/').pop()
    skills.push({
      title: fileName.replace(/\.[^.]+$/, ''),   // bo extension lam title
      description: file.path,                     // duong dan day du lam mo ta
      file: 'ai-skills/' + file.path,
      category: 'ai',
      icon: iconForFile(fileName),
      tags: ['skill', file.path.includes('/') ? file.path.split('/')[0] : 'root'],
    })

    console.log(`  + ${file.path}`)
  }

  await writeFile(META_OUT, JSON.stringify(skills, null, 2) + '\n')
  console.log(`[fetch-ai-skills] Da ghi ${skills.length} skill vao ai-skills.json`)
}

main().catch((err) => {
  console.error('[fetch-ai-skills] Loi:', err.message)
  process.exit(1)
})
