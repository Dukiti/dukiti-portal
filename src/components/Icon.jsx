// Chỉ import icon thực sự dùng -> bundle nhẹ (tree-shaking).
// Khi thêm icon mới trong data/resources.js, nhớ import và thêm vào `registry`.
import {
  LayoutGrid,
  LayoutDashboard,
  BookOpen,
  GitBranch,
  Wrench,
  Palette,
  StickyNote,
  Smartphone,
  FileCode,
  Github,
  Braces,
  Network,
  Regex,
  Layers,
  Rocket,
  Settings,
  Shapes,
  Link,
  FileTerminal,
} from 'lucide-react'

const registry = {
  LayoutGrid,
  LayoutDashboard,
  BookOpen,
  GitBranch,
  Wrench,
  Palette,
  StickyNote,
  Smartphone,
  FileCode,
  Github,
  Braces,
  Network,
  Regex,
  Layers,
  Rocket,
  Settings,
  Shapes,
  Link,
  FileTerminal,
}

export function Icon({ name, ...props }) {
  const LucideIcon = registry[name] || Link
  return <LucideIcon {...props} />
}
