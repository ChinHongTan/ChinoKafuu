const axios = require('axios')
const PassThrough = require('stream').PassThrough;

const createStream = options => {
    const stream = new PassThrough({
        highWaterMark: (options && options.highWaterMark) || 1024 * 512,
    });
    stream.destroy = () => {
        stream._isDestroyed = true;
    };
    return stream;
};

class bilibili {
    View = 'https://api.bilibili.com/x/web-interface/view?'
    link = 'https://api.bilibili.com/x/player/playurl?'
    async getid(url) {
        let reg = RegExp('(http[s]?:\/\/)?(www.bilibili.com)\/')
        if (url.includes('www.bilibili.com')) {
            url = url.split('?')[0]
            url = url.replace(reg, "").split('/')[1]
            return url
        } else {
            throw "Must use bilibili url"
        }
    }
    async getinfo(id) {
        if (id.startsWith('BV')) {
            let r = await axios({
                method: 'get',
                url: `https://api.bilibili.com/x/web-interface/view?bvid=${id}`,
            })
            return r.data.data
        }
        if (id.startsWith('AV')) {
            let r = await axios({
                method: 'get',
                url: `https://api.bilibili.com/x/web-interface/view?aid=${id.slice(2,id.length)}`,
            })
            return r.data.data
        }
    }
    async getlink(id, cid) {
        let r = await axios({
            method: 'get',
            url: `https://api.bilibili.com/x/player/playurl?bvid=${id}&cid=${cid}&qn=32&otype=json`,
        })
        return r.data.data
    }
    async bdown(url, options) {
        let steam = createStream(options)
        let r = await axios({
            method: "get",
            url: url,
            responseType: 'stream'
        })
        r.data.pipe(steam)
        return steam
    }
}
module.exports = bilibili