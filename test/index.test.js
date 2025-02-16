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
    const input = "---\nInvalid front matter\n# Test";
    const result = await processor.process(input);
    expect(result.messages[0].message).toBe(
      "Invalid YAML front matter: missing closing delimiter",
    );
  });

  test("validates magic record in front matter", async () => {
    const input = "---\ntitle: Test\n---\n# Test";
    const result = await processor.process(input);
    expect(result.messages[0].message).toBe(
      "Missing magic record (this_file) in front matter",
    );
  });

  test("accepts valid magic record", async () => {
    const input = "---\nthis_file: test.md\ntitle: Test\n---\n# Test";
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
    const input = "---\nthis_file: test.md\n---\n# Test\n\n- [x] Task list item\n- [ ] Another task\n\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n\n~~strikethrough~~\n";
    const result = await processor.process(input);
    expect(result.toString()).toContain("- [x] Task list item");
    expect(result.toString()).toContain("| Column 1 | Column 2 |");
    expect(result.toString()).toContain("~~strikethrough~~");
  });

  test("processes frontmatter", async () => {
    const input = "---\nthis_file: test.md\ntitle: Test Document\n---\n# Test";
    const result = await processor.process(input);
    expect(result.toString()).toContain("title: Test Document");
  });
});
