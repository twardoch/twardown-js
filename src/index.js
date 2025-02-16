/**
 * @typedef {import('unified').Processor} Processor
 * @typedef {import('unified').Settings} Settings
 */

/**
 * Plugin options for twardown
 * @typedef {Object} TwardownOptions
 * @property {boolean} [validateMagicRecord=true] - Whether to validate magic records
 */

/**
 * Twardown plugin for unified/remark
 * @param {TwardownOptions} [options={}] - Plugin options
 * @returns {import('unified').Transformer}
 */
export function twardownPlugin(options = {}) {
  const opts = {
    validateMagicRecord: true,
    ...options,
  };

  return function transformer(tree, file) {
    // Validate magic record if enabled
    if (opts.validateMagicRecord) {
      const content = String(file);
      const lines = content.split("\n");

      // Check for YAML front matter with magic record
      const hasFrontMatter = lines[0]?.trim() === "---";
      if (!hasFrontMatter) {
        file.message("Missing YAML front matter");
        return tree;
      }

      // Find the end of front matter
      const endIndex = lines.findIndex(
        (line, i) => i > 0 && line.trim() === "---",
      );
      if (endIndex === -1) {
        file.message("Invalid YAML front matter: missing closing delimiter");
        return tree;
      }

      // Check for magic record in front matter
      const frontMatter = lines.slice(1, endIndex);
      const hasMagicRecord = frontMatter.some((line) =>
        line.trim().startsWith("this_file:"),
      );

      if (!hasMagicRecord) {
        file.message("Missing magic record (this_file) in front matter");
      }
    }

    return tree;
  };
}
