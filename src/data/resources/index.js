export { profile } from './profile'
export { categories } from './categories'

import { docs } from './docs'
import { tools } from './tools'
import { script } from './script'
import { notes } from './notes'

export const resources = [...docs, ...tools, ...script, ...notes]
