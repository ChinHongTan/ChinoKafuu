import * as bytes from 'bytes';
import * as FormData from 'form-data';
import * as fs from 'fs';
import {JSDOM} from 'jsdom';
import fetch from 'node-fetch';

const baseURL = 'https://ascii2d.obfs.dev/'
export type SearchMode = 'color' | 'bovw';
export type FileType = 'jpeg' | 'png';
export type SourceType =
    | 'pixiv'
    | 'twitter'
    | 'amazon'
    | 'dlsite'
    | 'tinami'
    | 'ニコニコ静画';

export interface Author {
    name: string;
    url: string;
}

export interface Source {
    type: SourceType;
    title: string;
    url: string;
    author?: Author;
}

export interface ExternalInfo {
    ref: string;
    content: Source | string;
}

export interface Item {
    hash: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    fileType: FileType;
    fileSize: number;
    source?: Source;
    externalInfo?: ExternalInfo;
}

export interface SearchResult {
    url: string;
    items: Item[];
}

function getDocument(htmlString: string) {
    const {
        window: {document},
    } = new JSDOM(htmlString);
    return document;
}

async function fetchDOM(endpoint: string): Promise<Document> {
    return getDocument(await fetch(endpoint).then((res) => res.text()));
}

async function getAuthToken(): Promise<string> {
    const document = await fetchDOM(baseURL);
    return document.querySelector<HTMLMetaElement>(
        'meta[name="csrf-token"]',
    )!.content;
}

function parseExternalSource(externalBox: Element): Source {
    const [titleElement, authorElement] = Array.from(
        externalBox.querySelectorAll<HTMLAnchorElement>('a')!,
    );
    return {
        type: externalBox
            .querySelector<HTMLImageElement>('img')!
            .alt.toLowerCase() as SourceType,
        title: titleElement.textContent!,
        url: titleElement.href,
        author: {
            name: authorElement.textContent!,
            url: authorElement.href,
        },
    };
}

function parseExternalInfo(itemBox: Element): ExternalInfo | undefined {
    const infoHeader = itemBox.querySelector('.info-header');
    if (!infoHeader) return;
    const externalBox = itemBox.querySelector('.external');
    if (!externalBox || !externalBox.textContent) return;

    const maybeSource = externalBox.querySelectorAll('img,a,a').length === 3;

    return {
        type: 'external',
        ref: infoHeader.textContent,
        content: maybeSource
            ? parseExternalSource(externalBox)
            : externalBox.textContent.trim(),
    } as ExternalInfo;
}

function parseSource(itemBox: Element): Source | undefined {
    const detailBox = itemBox.querySelector('.detail-box');
    if (!detailBox || detailBox.textContent!.trim() === '') return;
    const h6 = detailBox.querySelector('h6');
    if (!h6) return;

    const anchors = Array.from(h6.querySelectorAll<HTMLAnchorElement>('a')!);
    if (anchors[0] && anchors[0].textContent === 'amazon') {
        // amazon
        return {
            type: 'amazon',
            title: h6.childNodes[0].textContent!.trim(),
            url: anchors[0].href,
        };
    }

    if (anchors.length < 2) return;
    const [titleElement, authorElement] = anchors;

    return {
        type: h6.querySelector('small')!.textContent!.trim() as SourceType,
        title: titleElement.textContent!,
        url: titleElement.href,
        author: {
            name: authorElement.textContent!,
            url: authorElement.href,
        },
    };
}

function parseItem(itemBox: Element): Item {
    const hash = itemBox.querySelector<HTMLDivElement>('.hash')!.textContent!;
    const [size, fileType, fileSizeString] = itemBox
        .querySelector<HTMLSpanElement>('small.text-muted')!
        .textContent!.split(' ');
    const thumbnailUrl =
        baseURL +
        itemBox.querySelector<HTMLImageElement>('.image-box > img')!.src;
    const [width, height] = size.split('x').map((s) => parseInt(s));
    const fileSize = bytes(fileSizeString);

    const item = {
        hash,
        thumbnailUrl,
        width,
        height,
        fileType: fileType.toLowerCase() as FileType,
        fileSize,
    } as Item;

    item.externalInfo = parseExternalInfo(itemBox);
    item.source = parseSource(itemBox);

    return item;
}

function parseSearchResult(htmlString: string): Item[] {
    const document = getDocument(htmlString);
    return Array.from(document.querySelectorAll('.item-box'))
        .slice(1)
        .map(parseItem);
}

async function getSearchHash(query: string | fs.ReadStream) {
    const searchType = query instanceof fs.ReadStream ? 'file' : 'uri';
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('authenticity_token', token);
    formData.append(searchType, query);
    const response = await fetch(`${baseURL}search/${searchType}`, {
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

export async function searchByUrl(
    imageUrl: string,
    mode: SearchMode = 'color',
): Promise<SearchResult> {
    const hash = await getSearchHash(imageUrl);
    const url = `${baseURL}search/${mode}/${hash}`;
    const result = await fetch(url).then((res) => res.text());
    const items = parseSearchResult(result);

    return {url, items};
}

export async function searchByFile(
    filePath: string,
    mode: SearchMode = 'color',
): Promise<SearchResult> {
    const readStream = fs.createReadStream(filePath);
    const hash = await getSearchHash(readStream);
    const url = `${baseURL}search/${mode}/${hash}`;
    const result = await fetch(url).then((res) => res.text());
    const items = parseSearchResult(result);

    return {url, items};
}