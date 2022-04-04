import Pixiv from 'pixiv.ts';
const refreshToken = process.env.PIXIV_REFRESH_TOKEN || require('../config/config.json').PixivRefreshToken;
import * as fs from 'fs';

async function updateIllust(query: string) {
    const pixiv = await Pixiv.refreshLogin(refreshToken);
    let illusts = await pixiv.search.illusts({ word: query, r18: false, type: 'illust', bookmarks: '1000', search_target: 'partial_match_for_tags' });
    if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({ next_url: pixiv.search.nextURL, illusts });

    fs.writeFileSync('./data/illusts.json', JSON.stringify(illusts));
    return;
}

module.exports = updateIllust;