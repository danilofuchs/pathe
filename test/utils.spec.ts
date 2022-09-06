import { describe, expect, it } from 'vitest'

import { normalizeAliases, filename, resolveAlias } from '../src/utils'

describe('alias', () => {
  const _aliases = {
    '@foo/bar': '@foo/bar/dist/index.mjs',
    '@foo/bar/utils': '@foo/bar/dist/utils.mjs',
    '@': '/root',
    bingpot: '@/bingpot/index.ts',
    test: '@bingpot/index.ts'
  }
  const aliases = normalizeAliases(_aliases)

  it('normalizeAliases', () => {
    expect(aliases).toMatchInlineSnapshot(`
      {
        "@": "/root",
        "@foo/bar": "@foo/bar/dist/index.mjs",
        "@foo/bar/utils": "@foo/bar/dist/utils.mjs",
        "bingpot": "/root/bingpot/index.ts",
        "test": "@bingpot/index.ts",
      }
    `)
  })

  describe('resolveAlias', () => {
    for (const [from, to] of Object.entries(aliases)) {
      it(from, () => {
        expect(resolveAlias(from, aliases)).toBe(to)
      })
    }
    it('unchanged', () => {
      expect(resolveAlias('foo/bar.js', aliases)).toBe('foo/bar.js')
    })
  })
})

describe('filename', () => {
  const files = {
  // POSIX
    'test.html': 'test',
    '/temp/myfile.html': 'myfile',
    './myfile.html': 'myfile',

    // Windows
    'C:\\temp\\': undefined,
    'C:\\temp\\myfile.html': 'myfile',
    '\\temp\\myfile.html': 'myfile',
    '.\\myfile.html': 'myfile'
  }
  for (const file in files) {
    it(file, () => {
      expect(filename(file)).toEqual(files[file])
    })
  }
})
