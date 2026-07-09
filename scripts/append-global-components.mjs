// Appends the `declare module 'vue'` GlobalComponents augmentation from
// src/global-components.ts to dist/hisonvue.d.ts (vite-plugin-dts bundle).
// The import block is stripped: every HXxx type already exists in the bundle,
// so `typeof HXxx` resolves within the same file.
// Replaces the former dts-bundle-generator step, whose CLI/config no longer
// matched the installed version and always failed.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dtsPath = join(root, 'dist', 'hisonvue.d.ts')
const srcPath = join(root, 'src', 'global-components.ts')

const source = readFileSync(srcPath, 'utf8')
const marker = "declare module 'vue'"
const at = source.indexOf(marker)
if (at === -1) {
  console.error('[append-global-components] marker not found in global-components.ts')
  process.exit(1)
}
const augmentation = source.slice(at)

let dts = readFileSync(dtsPath, 'utf8')
if (dts.includes(marker)) {
  console.log('[append-global-components] augmentation already present — skipped')
  process.exit(0)
}
dts = dts.replace(/\s*$/, '\n\n') + augmentation
writeFileSync(dtsPath, dts)
console.log('[append-global-components] GlobalComponents augmentation appended to dist/hisonvue.d.ts')
