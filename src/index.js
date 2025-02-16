/**
 * @typedef {import('unified').Processor} Processor
 * @typedef {import('unified').Settings} Settings
 */

import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkLint from 'remark-lint';

/**
 * Plugin options for twardown
 * @typedef {Object} TwardownOptions
 * @property {boolean} [validateMagicRecord=true] - Whether to validate magic records
 * @property {Object} [gfm] - Options for remark-gfm
 * @property {Object} [frontmatter] - Options for remark-frontmatter
 * @property {Object} [lint] - Options for remark-lint
 */

/**
 * Twardown plugin for unified/remark
 * Wraps multiple Remark plugins with sensible defaults:
 * - remark-gfm: GitHub Flavored Markdown support
 * - remark-frontmatter: YAML frontmatter support
 * - remark-lint: Markdown linting
 * - Custom magic record validation
 * 
 * @param {TwardownOptions} [options={}] - Plugin options
 * @returns {import('unified').Transformer}
 */
export function twardownPlugin(options = {}) {
  const opts = {
    validateMagicRecord: true,
    gfm: {},
    frontmatter: ['yaml'],
    lint: {},
    ...options,
  };

  return function transformer(tree, file) {
    // Configure the processor with wrapped plugins
    const processor = this;

    // Add remark-gfm
    if (!processor.data('gfmAdded')) {
      try {
        processor.use(remarkGfm, opts.gfm);
        processor.data('gfmAdded', true);
      } catch (error) {
        file.message('Failed to load remark-gfm plugin');
      }
    }

    // Add remark-frontmatter
    if (!processor.data('frontmatterAdded')) {
      try {
        processor.use(remarkFrontmatter, opts.frontmatter);
        processor.data('frontmatterAdded', true);
      } catch (error) {
        file.message('Failed to load remark-frontmatter plugin');
      }
    }

    // Add remark-lint
    if (!processor.data('lintAdded')) {
      try {
        processor.use(remarkLint, opts.lint);
        processor.data('lintAdded', true);
      } catch (error) {
        file.message('Failed to load remark-lint plugin');
      }
    }

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
