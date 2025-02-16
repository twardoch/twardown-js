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
    expect(result.messages[0].message).toBe(
      "Missing magic record at the start of the file",
    );
  });

  test("accepts valid magic record", async () => {
    const input = "// this_file: test.md\n# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin);

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(0);
    expect(String(result)).toBe(input + "\n");
  });

  test("can disable magic record validation", async () => {
    const input = "# Hello World";
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(twardownPlugin, { validateMagicRecord: false });

    const result = await processor.process(input);
    expect(result.messages).toHaveLength(0);
    expect(String(result)).toBe(input + "\n");
  });
});
