export { profile } from './profile'
export { categories } from './categories'

import { docs } from './docs'
import { ai } from './ai'
import { script } from './script'
import { notes } from './notes'

export const resources = [...docs, ...ai, ...script, ...notes]
