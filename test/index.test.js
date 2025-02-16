// this_file: twardown-js/test/index.test.js

import { describe, expect, test } from "@jest/globals";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { twardownPlugin } from "../src/index.js";

describe("twardown plugin", () => {
  test("validates magic record presence", async () => {
    const input = "# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin);

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].message).toBe("Missing YAML front matter");
  });

  test("validates front matter format", async () => {
    const input = "---\nInvalid front matter\n# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin);

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].message).toBe(
      "Invalid YAML front matter: missing closing delimiter"
    );
  });

  test("validates magic record in front matter", async () => {
    const input = "---\ntitle: Test\n---\n# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin);

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].message).toBe(
      "Missing magic record (this_file) in front matter"
    );
  });

  test("accepts valid magic record", async () => {
    const input = "---\nthis_file: test.md\ntitle: Test\n---\n# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin);

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(0);
  });

  test("can disable magic record validation", async () => {
    const input = "# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin, { validateMagicRecord: false });

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(0);
  });
});
