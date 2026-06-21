// Fetch .ai/ folder trong repo Dukiti/ai-agent (private) luc BUILD.
// Cau truc repo:
//   .ai/agents/<name>/AGENT.md
//   .ai/rules/<name>/RULES.md
//   .ai/skills/<platform>/<category>/<name>/SKILL.md

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT       = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_DIR = join(ROOT, 'public', 'ai-skills')
const META_OUT   = join(ROOT, 'src', 'data', 'ai-skills.json')
const REPO       = 'Dukiti/ai-agent'
const token      = process.env.GH_REPOS_TOKEN

function ghFetch(path) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

// Trich xuat YAML frontmatter don gian (khong can thu vien)
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const fm = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    fm[key] = val
  }
  return fm
}

// "build_and_tooling" -> "Build & Tooling"
function formatCategory(str) {
  return str
    .replace(/_and_/g, ' & ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bUi\b/, 'UI')
}

// "android-architecture" -> "Android Architecture"
function toTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// Phan tich duong dan -> { title, description, group, tags, icon }
function parsePath(filePath, fm) {
  const parts = filePath.split('/')  // ['.ai', kind, ...]
  const kind  = parts[1]             // 'agents' | 'rules' | 'skills'

  const name = fm.name || ''
  const desc = fm.description || ''

  if (kind === 'agents') {
    const folderName = parts[2]
    return {
      title: name ? toTitle(name) : toTitle(folderName),
      description: desc,
      group: 'Agents',
      tags: ['agent'],
      icon: 'Bot',
    }
  }

  if (kind === 'rules') {
    const folderName = parts[2]
    return {
      title: name ? toTitle(name) : toTitle(folderName),
      description: desc,
      group: 'Rules',
      tags: ['rule'],
      icon: 'BookOpen',
    }
  }

  if (kind === 'skills') {
    // .ai/skills/<platform>/<category>/<name>/SKILL.md
    const platform = parts[2] || ''
    const category = parts[3] || ''
    const folderName = parts[4] || ''
    const catLabel = formatCategory(category)
    return {
      title: name ? toTitle(name) : toTitle(folderName),
      description: desc,
      group: 'Skills / ' + catLabel,
      tags: ['skill', platform, category].filter(Boolean),
      icon: 'Sparkles',
    }
  }

  return {
    title: toTitle(parts[parts.length - 2] || filePath),
    description: desc,
    group: formatCategory(kind),
    tags: [kind],
    icon: 'FileText',
  }
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true })

  if (!token) {
    console.warn('[fetch-ai-skills] Khong co GH_REPOS_TOKEN -> ghi mang rong.')
    await writeFile(META_OUT, '[]\n')
    return
  }

  const treeRes = await ghFetch('git/trees/HEAD?recursive=1')
  if (treeRes.status === 409) {
    console.warn('[fetch-ai-skills] Repo chua co commit -> ghi mang rong.')
    await writeFile(META_OUT, '[]\n')
    return
  }
  if (!treeRes.ok) throw new Error(`Tree API ${treeRes.status}: ${await treeRes.text()}`)
  const { tree } = await treeRes.json()

  const files = tree.filter(
    (node) => node.type === 'blob' && node.path.startsWith('.ai/') && node.path.match(/\.(md|MD)$/)
  )

  console.log(`[fetch-ai-skills] Tim thay ${files.length} file trong ${REPO}`)

  const skills = []

  for (const file of files) {
    const contentRes = await ghFetch(`contents/${file.path}`)
    if (!contentRes.ok) {
      console.warn(`  Bo qua ${file.path}: ${contentRes.status}`)
      continue
    }
    const data    = await contentRes.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')

    const localPath = join(PUBLIC_DIR, file.path)
    await mkdir(dirname(localPath), { recursive: true })
    await writeFile(localPath, content)

    const fm = parseFrontmatter(content)
    const { title, description, group, tags, icon } = parsePath(file.path, fm)

    skills.push({
      title,
      description,
      file: 'ai-skills/' + file.path,
      category: 'ai',
      group,
      icon,
      tags,
    })

    console.log(`  + [${group}] ${title}`)
  }

  // Sap xep: Agents -> Rules -> Skills (theo group)
  skills.sort((a, b) => {
    const order = ['Agents', 'Rules']
    const ai = order.indexOf(a.group) === -1 ? 99 : order.indexOf(a.group)
    const bi = order.indexOf(b.group) === -1 ? 99 : order.indexOf(b.group)
    if (ai !== bi) return ai - bi
    return a.group.localeCompare(b.group) || a.title.localeCompare(b.title)
  })

  await writeFile(META_OUT, JSON.stringify(skills, null, 2) + '\n')
  console.log(`[fetch-ai-skills] Da ghi ${skills.length} entries vao ai-skills.json`)
}

main().catch((err) => {
  console.error('[fetch-ai-skills] Loi:', err.message)
  process.exit(1)
})
