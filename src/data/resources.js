// ============================================================
//  DỮ LIỆU TÀI NGUYÊN — chỉ cần sửa file này để thêm/bớt mục.
//  - `icon`: tên icon từ lucide-react (https://lucide.dev/icons)
//  - `category`: phải khớp với một id trong mảng `categories`
// ============================================================

export const profile = {
  name: 'Dung Nguyen Minh',
  role: 'Developer',
  location: 'Ha Noi, Vietnam',
  initials: 'DM',
  // Username GitHub: mục "Repositories" sẽ tự fetch repo public của tài khoản này.
  githubUser: 'Dukiti',
}

export const categories = [
  { id: 'all', label: 'Tất cả', icon: 'LayoutGrid' },
  { id: 'docs', label: 'Docs', icon: 'BookOpen' },
  { id: 'repos', label: 'Repositories', icon: 'GitBranch' },
  { id: 'tools', label: 'Dev Tools', icon: 'Wrench' },
  { id: 'script', label: 'Script', icon: 'FileTerminal' },
  { id: 'notes', label: 'Tech Notes', icon: 'StickyNote' },
]

export const resources = [
  {
    title: 'Android SDK Docs',
    description: 'Reference, release notes và tài liệu tích hợp.',
    url: 'https://developer.android.com',
    category: 'docs',
    icon: 'Smartphone',
    tags: ['android', 'sdk'],
  },
  {
    title: 'Kotlin Docs',
    description: 'Ngôn ngữ, coroutines và stdlib reference.',
    url: 'https://kotlinlang.org/docs/home.html',
    category: 'docs',
    icon: 'FileCode',
    tags: ['kotlin'],
  },
  // Mục có `file` (đường dẫn trong public/) sẽ hiện nút tải file về.
  {
    title: 'Zip Folder (.ps1)',
    description: 'Nén folder thành .zip, tuỳ chọn đặt mật khẩu AES-256. Yêu cầu 7-Zip.',
    file: 'scripts/zip-folder.ps1',
    category: 'script',
    icon: 'FileTerminal',
    tags: ['powershell', 'windows', '7zip', 'zip'],
  },
  {
    title: 'Zip Folder (.bat)',
    description: 'Click đúp chạy ngay — hỏi folder và password rồi gọi zip-folder.ps1 tự động.',
    file: 'scripts/zip-folder.bat',
    category: 'script',
    icon: 'FileTerminal',
    tags: ['bat', 'windows', 'launcher'],
  },
  // Lưu ý: mục "repos" giờ được nạp tự động từ GitHub (xem useGithubRepos),
  // nên không cần khai báo repo thủ công ở đây nữa.
  {
    title: 'Swagger / OpenAPI',
    description: 'API specification và client config.',
    url: 'https://swagger.io',
    category: 'docs',
    icon: 'Network',
    tags: ['api', 'swagger'],
  },
  {
    title: 'Regex101',
    description: 'Kiểm thử và giải thích regex trực tiếp.',
    url: 'https://regex101.com',
    category: 'tools',
    icon: 'Regex',
    tags: ['regex'],
  },
  {
    title: 'JSON Formatter',
    description: 'Format, validate và minify JSON.',
    url: 'https://jsonformatter.org',
    category: 'tools',
    icon: 'Wrench',
    tags: ['json', 'utility'],
  },
  {
    title: 'Figma Design Tokens',
    description: 'Color, typography và component library.',
    url: 'https://figma.com',
    category: 'design',
    icon: 'Palette',
    tags: ['figma', 'tokens'],
  },
  {
    title: 'Compose Components',
    description: 'Ghi chú & guideline cho Jetpack Compose.',
    url: 'https://developer.android.com/jetpack/compose',
    category: 'notes',
    icon: 'Layers',
    tags: ['compose', 'ui'],
  },
  {
    title: 'CI/CD Notes',
    description: 'GitHub Actions, build và release flow.',
    url: 'https://docs.github.com/actions',
    category: 'notes',
    icon: 'Rocket',
    tags: ['ci', 'cd'],
  },
  {
    title: 'Gradle Docs',
    description: 'Build script, dependency và plugin.',
    url: 'https://docs.gradle.org',
    category: 'tools',
    icon: 'Settings',
    tags: ['gradle', 'build'],
  },
  {
    title: 'Material Design 3',
    description: 'Hướng dẫn design system của Google.',
    url: 'https://m3.material.io',
    category: 'design',
    icon: 'Shapes',
    tags: ['material', 'design'],
  },
]
