"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByUrl = void 0;
const bytes = require("bytes");
const FormData = require("form-data");
const fs = require("fs");
const jsdom_1 = require("jsdom");
const node_fetch_1 = require("node-fetch");
const baseURL = 'https://ascii2d.obfs.dev/';
function getDocument(htmlString) {
    const { window: { document }, } = new jsdom_1.JSDOM(htmlString);
    return document;
}
async function fetchDOM(endpoint) {
    return getDocument(await (0, node_fetch_1.default)(endpoint).then((res) => res.text()));
}
async function getAuthToken() {
    const document = await fetchDOM(baseURL);
    return document.querySelector('meta[name="csrf-token"]').content;
}
function parseExternalSource(externalBox) {
    const [titleElement, authorElement] = Array.from(externalBox.querySelectorAll('a'));
    return {
        type: externalBox
            .querySelector('img')
            .alt.toLowerCase(),
        title: titleElement.textContent,
        url: titleElement.href,
        author: {
            name: authorElement.textContent,
            url: authorElement.href,
        },
    };
}
function parseExternalInfo(itemBox) {
    const infoHeader = itemBox.querySelector('.info-header');
    if (!infoHeader)
        return;
    const externalBox = itemBox.querySelector('.external');
    if (!externalBox || !externalBox.textContent)
        return;
    const maybeSource = externalBox.querySelectorAll('img,a,a').length === 3;
    return {
        type: 'external',
        ref: infoHeader.textContent,
        content: maybeSource
            ? parseExternalSource(externalBox)
            : externalBox.textContent.trim(),
    };
}
function parseSource(itemBox) {
    const detailBox = itemBox.querySelector('.detail-box');
    if (!detailBox || detailBox.textContent.trim() === '')
        return;
    const h6 = detailBox.querySelector('h6');
    if (!h6)
        return;
    const anchors = Array.from(h6.querySelectorAll('a'));
    if (anchors[0] && anchors[0].textContent === 'amazon') {
        // amazon
        return {
            type: 'amazon',
            title: h6.childNodes[0].textContent.trim(),
            url: anchors[0].href,
        };
    }
    if (anchors.length < 2)
        return;
    const [titleElement, authorElement] = anchors;
    return {
        type: h6.querySelector('small').textContent.trim(),
        title: titleElement.textContent,
        url: titleElement.href,
        author: {
            name: authorElement.textContent,
            url: authorElement.href,
        },
    };
}
function parseItem(itemBox) {
    const hash = itemBox.querySelector('.hash').textContent;
    const [size, fileType, fileSizeString] = itemBox
        .querySelector('small.text-muted')
        .textContent.split(' ');
    const thumbnailUrl = baseURL +
        itemBox.querySelector('.image-box > img').src;
    const [width, height] = size.split('x').map((s) => parseInt(s));
    const fileSize = bytes(fileSizeString);
    const item = {
        hash,
        thumbnailUrl,
        width,
        height,
        fileType: fileType.toLowerCase(),
        fileSize,
    };
    item.externalInfo = parseExternalInfo(itemBox);
    item.source = parseSource(itemBox);
    return item;
}
function parseSearchResult(htmlString) {
    const document = getDocument(htmlString);
    return Array.from(document.querySelectorAll('.item-box'))
        .slice(1)
        .map(parseItem);
}
async function getSearchHash(query) {
    const searchType = query instanceof fs.ReadStream ? 'file' : 'uri';
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('authenticity_token', token);
    formData.append(searchType, query);
    const response = await (0, node_fetch_1.default)(`${baseURL}search/${searchType}`, {
        method: 'POST',
        body: formData,
        redirect: 'manual',
    });
    const url = response.headers.get('location');
    if (!url) {
        throw new Error(`Image size is too large`);
    }
    const searchHash = url.match(/\/([^/]+)$/)?.[1];
    if (!searchHash) {
        throw new Error(`Invalid image format`);
    }
    return searchHash;
}
async function searchByUrl(imageUrl, mode = 'color') {
    const hash = await getSearchHash(imageUrl);
    const url = `${baseURL}search/${mode}/${hash}`;
    const result = await (0, node_fetch_1.default)(url).then((res) => res.text());
    const items = parseSearchResult(result);
    return { url, items };
}
exports.searchByUrl = searchByUrl;
//# sourceMappingURL=ascii2d.js.map