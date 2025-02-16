/**
 * @typedef {import('unified').Processor} Processor
 * @typedef {import('unified').Settings} Settings
 */

/**
 * Plugin options
 * @typedef {Object} Options
 * @property {boolean} [option1=true] - Description of option1
 */

/**
 * Twardown plugin for remark to provide an opinionated Markdown flavor.
 * @type {import('unified').Plugin}
 */
export default function twardown() {
  return (tree) => {
    // TODO: Add actual plugin functionality
    return tree
  }
}
