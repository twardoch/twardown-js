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
      const lines = content.split('\n');
      const firstLine = lines[0];

      if (!firstLine || !firstLine.trim().startsWith('// this_file:')) {
        file.message('Missing magic record at the start of the file');
      }
    }

    return tree;
  };
}
