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

// "android-architecture" -> "Android Architecture"
function toTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// Phan tich duong dan -> { type, title, tags, icon }
function parsePath(filePath) {
  // filePath vi du: .ai/skills/android/architecture/android-architecture/SKILL.md
  const parts = filePath.split('/')  // ['.ai', 'skills', 'android', 'architecture', 'android-architecture', 'SKILL.md']
  const kind = parts[1]              // 'agents' | 'rules' | 'skills'

  if (kind === 'agents') {
    const name = parts[2]
    return {
      title: toTitle(name),
      tags: ['agent', ...name.split('-').slice(0, 2)],
      icon: 'Bot',
    }
  }

  if (kind === 'rules') {
    const name = parts[2]
    return {
      title: toTitle(name),
      tags: ['rule', ...name.split('-').slice(0, 2)],
      icon: 'BookOpen',
    }
  }

  if (kind === 'skills') {
    // .ai/skills/<platform>/<category>/<name>/SKILL.md
    const platform = parts[2] || ''   // 'android'
    const category = parts[3] || ''   // 'architecture' | 'ui' | ...
    const name     = parts[4] || ''   // 'android-architecture'
    return {
      title: toTitle(name || category),
      tags: ['skill', platform, category].filter(Boolean),
      icon: 'Sparkles',
    }
  }

  return { title: toTitle(parts[parts.length - 2] || filePath), tags: [kind], icon: 'FileText' }
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

  // Chi lay cac file markdown ben trong .ai/
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

    // Luu file vao public/ai-skills/
    const localPath = join(PUBLIC_DIR, file.path)
    await mkdir(dirname(localPath), { recursive: true })
    await writeFile(localPath, content)

    const { title, tags, icon } = parsePath(file.path)
    // Lay dong dau tien cua markdown lam description (bo #)
    const firstLine = content.split('\n').find((l) => l.trim())?.replace(/^#+\s*/, '').trim()

    skills.push({
      title,
      description: firstLine || file.path,
      file: 'ai-skills/' + file.path,
      category: 'ai',
      icon,
      tags,
    })

    console.log(`  + [${tags[0]}] ${title}`)
  }

  await writeFile(META_OUT, JSON.stringify(skills, null, 2) + '\n')
  console.log(`[fetch-ai-skills] Da ghi ${skills.length} entries vao ai-skills.json`)
}

main().catch((err) => {
  console.error('[fetch-ai-skills] Loi:', err.message)
  process.exit(1)
})
