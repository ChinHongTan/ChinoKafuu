"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByFile = exports.searchByUrl = void 0;
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
function fetchDOM(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        return getDocument(yield (0, node_fetch_1.default)(endpoint).then((res) => res.text()));
    });
}
function getAuthToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield fetchDOM(baseURL);
        const token = document.querySelector('meta[name="csrf-token"]').content;
        return token;
    });
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
    const items = Array.from(document.querySelectorAll('.item-box'))
        .slice(1)
        .map(parseItem);
    return items;
}
function getSearchHash(query) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const searchType = query instanceof fs.ReadStream ? 'file' : 'uri';
        const token = yield getAuthToken();
        const formData = new FormData();
        formData.append('authenticity_token', token);
        formData.append(searchType, query);
        const response = yield (0, node_fetch_1.default)(`${baseURL}search/${searchType}`, {
            method: 'POST',
            body: formData,
            redirect: 'manual',
        });
        const url = response.headers.get('location');
        if (!url) {
            throw new Error(`Image size is too large`);
        }
        const searchHash = (_a = url.match(/\/([^/]+)$/)) === null || _a === void 0 ? void 0 : _a[1];
        if (!searchHash) {
            throw new Error(`Invalid image format`);
        }
        return searchHash;
    });
}
function searchByUrl(imageUrl, mode = 'color') {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield getSearchHash(imageUrl);
        const url = `${baseURL}search/${mode}/${hash}`;
        const result = yield (0, node_fetch_1.default)(url).then((res) => res.text());
        const items = parseSearchResult(result);
        return { url, items };
    });
}
exports.searchByUrl = searchByUrl;
function searchByFile(filePath, mode = 'color') {
    return __awaiter(this, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filePath);
        const hash = yield getSearchHash(readStream);
        const url = `${baseURL}search/${mode}/${hash}`;
        const result = yield (0, node_fetch_1.default)(url).then((res) => res.text());
        const items = parseSearchResult(result);
        return { url, items };
    });
}
exports.searchByFile = searchByFile;
//# sourceMappingURL=ascii2d.js.map