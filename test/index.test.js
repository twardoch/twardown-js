import { describe, expect, test } from '@jest/globals';
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { twardownPlugin } from '../src/index.js'

describe('twardown plugin', () => {
  test('basic functionality', async () => {
    const input = '# Hello World'
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin)

    const result = await processor.process(input)
    expect(String(result)).toBe(input + '\n')
  })

  test('with magic record', async () => {
    const input = '// this_file: test.md\n# Hello World'
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin)

    const result = await processor.process(input)
    expect(String(result)).toBe(input + '\n')
  })
})
