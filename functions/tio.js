const { request } = require('https');
const { deflateRawSync, gunzipSync } = require('zlib');
const { randomBytes } = require('crypto');
const getRequestBody = (c, l) => deflateRawSync(Buffer.from(`Vlang\0${1}\0${l}\0VTIO_OPTIONS\0${0}\0F.code.tio\0${c.length}\0${c}F.input.tio\0${0}\0Vargs\0${0}\0R`, 'binary'), { level: 9 });

/**
 * @typedef {Object} TioResponse
 * @property {string} output The code output.
 */

let runURL = null;
let languages = null;

/**
 * @async
 * Does a simple GET request to the TIO page. Used primarily for scraping.
 * @param {string} [path] The request path.
 * @returns {Promise<string>} The request response.
 */
function requestText(path) {
    return new Promise(resolve => {
        request({
            method: 'GET',
            host: 'tio.run',
            path: path || '/',
        }, response => {
            let str = '';
            response.on('data', data => str += data);
            response.once('end', () => resolve(str));
        }).end();
    });
}

/**
 * @async
 * Handles if a language is available to use or not.
 * @returns {Promise<string>} The resolved language.
 */
async function resolveLanguage(language) {
    language = language.toLowerCase();
    if (!languages) languages = Object.keys(JSON.parse(await requestText('/languages.json'))).map(x => x.toLowerCase());
    if (languages.includes(language)) return language;

    throw new TypeError('Invalid language.');
}

/**
 * @async
 * Prepares the request.
 * @returns {Promise<undefined>}
 */
async function prepare() {
    if (runURL) return;
    const scrapeResponse = await requestText();
    const frontendJSurl = scrapeResponse.match(/<script src="(\/static\/[0-9a-f]+-frontend\.js)" defer><\/script>/)[1];
    if (!frontendJSurl) throw new Error('An error occurred while scraping tio.run.');
    const frontendJS = await requestText(frontendJSurl);
    runURL = frontendJS.match(/^var runURL = "\/cgi-bin\/static\/([^"]+)";$/m)[1];

    if (!runURL) throw new Error('An error occurred while scraping tio.run.');
}

/**
 * @async tio
 * Evaluates code through the TryItOnline API.
 * @param {string} code The code to run.
 * @param {string} [language] The programming language to use. Uses the default language if not specified.
 * @param {number} [timeout] After how much time should the code execution timeout. (in ms)
 * @returns {Promise<TioResponse>} The code response.
 */
async function tio(code, language, timeout) {

    language = await resolveLanguage(language);
    await prepare();
    let response = await new Promise(resolve => {
        const currentRequest = request({
            host: 'tio.run',
            path: `/cgi-bin/static/${runURL}/${randomBytes(16).toString('hex')}`,
            method: 'POST',
        }, resp => {
            let buf = Buffer.alloc(0);
            resp.on('data', d => buf = Buffer.concat([buf, d]));
            resp.once('end', () => resolve(gunzipSync(buf).toString()));
        });

        if (timeout) {
            currentRequest.setTimeout(timeout, () => {
                if (!currentRequest.destroyed) currentRequest.destroy();
                resolve(null);
            });
        }

        currentRequest.end(getRequestBody(
            decodeURIComponent(encodeURIComponent(code)),
            decodeURIComponent(encodeURIComponent(language)),
        ));
    });

    if (!response) {
        return {
            output: `Request timed out after ${timeout}ms`,
        };
    }

    response = response.replace(new RegExp(response.slice(-16).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '');
    const split = response.split('\n');
    return {
        output: split.slice(0, -5).join('\n').trim(),
    };
}

/**
 * @async getLanguages
 * Fetches all the available languages.
 * @returns {Promise<string[]>} The list of available languages.
 */
async function getLanguages() {
    if (!languages) languages = Object.keys(JSON.parse(await requestText('/languages.json'))).map(x => x.toLowerCase());
    return languages;
}

module.exports = { tio, getLanguages };