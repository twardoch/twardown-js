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
 * Twardown plugin for remark
 * @type {import('unified').Plugin<[Options?]>}
 */
export default function remarkTwardown(options = {}) {
    const settings = {
        option1: true,
        ...options
    }

    /**
     * @param {Processor} processor
     */
    return function (processor) {
        // TODO: Add actual plugin configuration here
        // This will include registering all the plugins that make up the Twardown flavor
    }
}
