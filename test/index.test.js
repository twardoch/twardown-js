// this_file: twardown-js/test/index.test.js

import { describe, expect, test } from "@jest/globals";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { twardownPlugin } from "../src/index.js";

describe("twardown plugin", () => {
  let processor;

  beforeEach(() => {
    processor = unified()
      .use(remarkParse)
      .use(twardownPlugin)
      .use(remarkStringify);
  });

  test("validates magic record presence", async () => {
    const input = "# Test";
    const result = await processor.process(input);
    expect(result.messages[0].message).toBe("Missing YAML front matter");
  });

  test("validates front matter format", async () => {
    const input = `---
invalid front matter
# Test`;
    const result = await processor.process(input);
    expect(result.messages[0].message).toBe(
      "Invalid YAML front matter: missing closing delimiter",
    );
  });

  test("validates magic record in front matter", async () => {
    const input = `---
title: Test
---
# Test`;
    const result = await processor.process(input);
    expect(result.messages[0].message).toBe(
      "Missing magic record (this_file) in front matter",
    );
  });

  test("accepts valid magic record", async () => {
    const input = `---
this_file: test.md
---
# Test`;
    const result = await processor.process(input);
    expect(result.messages).toHaveLength(0);
  });

  test("can disable magic record validation", async () => {
    const customProcessor = unified()
      .use(remarkParse)
      .use(twardownPlugin, { validateMagicRecord: false })
      .use(remarkStringify);

    const input = "# Test";
    const result = await customProcessor.process(input);
    expect(result.messages).toHaveLength(0);
  });

  test("processes GFM features", async () => {
    const input = `---
this_file: test.md
---
# Test

- [x] Task list item
- [ ] Another task

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

~~strikethrough~~`;
    const result = await processor.process(input);
    expect(result.toString()).toContain("- [x] Task list item");
    expect(result.toString()).toContain("| Column 1 | Column 2 |");
    expect(result.toString()).toContain("~~strikethrough~~");
  });

  test("processes frontmatter", async () => {
    const input = `---
this_file: test.md
title: Test Document
---
# Test`;
    const result = await processor.process(input);
    expect(result.toString()).toContain("title: Test Document");
  });
});
