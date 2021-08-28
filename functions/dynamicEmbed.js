const __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const __generator = (this && this.__generator) || function(thisArg, body) {
    let _ = {
        label: 0,
        sent() {
            if (t[0] & 1) throw t[1]; return t[1];
        },
        trys: [],
        ops: [],
    }; let f; let y; let t; let g;
    return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError('Generator is already executing.');
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0; continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1]; break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1]; t = op; break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2]; _.ops.push(op); break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e]; y = 0;
            }
            finally {
                f = t = 0;
            }
        }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * Function to update embed message after a user had reacted
 * @param {MessageReaction} r - Reaction from the user
 * @param {number} page - Which result to be displayed
 * @param {object} itemList - The result from the API.
 * @param {object} embedMessage - Discord message with an embed.
 * @param {function} createEmbed - Function to create embed.
 * @param {object} collector - Discord reaction collector.
 * @param {function} collectorFunc - Function after stopping the collector.
 * @param {any[]} collectorParams - parameters for collector function.
 * @return {number} Page
 */
function updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams) {
    let editedEmbed;
    switch (r.emoji.name) {
    case '⬅️':
        page -= 1;
        if (page < 0) {
            page = itemList.length - 1;
        }
        itemList.page = page;
        itemList.total = itemList.length;
        editedEmbed = createEmbed(itemList[page]);
        embedMessage.edit(editedEmbed);
        if (collectorParams && collectorParams.length > 1) {
            collectorParams[1] = page;
        }
        break;
    case '➡️':
        page += 1;
        if (page + 1 > itemList.length) {
            page = 0;
        }
        itemList.page = page;
        itemList.total = itemList.length;
        editedEmbed = createEmbed(itemList[page]);
        embedMessage.edit(editedEmbed);
        if (collectorParams && collectorParams.length > 1) {
            collectorParams[1] = page;
        }
        break;
    case '▶️':
        collector.stop();
        collectorFunc.apply(void 0, collectorParams);
        embedMessage.delete();
        break;
    }
    return page;
}
const DynamicEmbed = /** @class */ (function() {
    function DynamicEmbed() {
    }
    /**
    * Creates and sends a reactable message
    * @param {object} result - The result from the API.
    */
    DynamicEmbed.prototype.createEmbedFlip = function(message, itemList, emojiList, createEmbed, collectorFunc, collectorParams) {
        return __awaiter(this, void 0, void 0, function() {
            let page; let embed; let embedMessage; let _i; let emojiList_1; let emoji; let filter; let collector;
            return __generator(this, (_a) => {
                switch (_a.label) {
                case 0:
                    page = 0;
                    if (typeof itemList[page] === 'object') {
                        itemList.page = page;
                        itemList.total = itemList.length;
                    }
                    embed = createEmbed(itemList[page]);
                    return [4 /* yield */, message.channel.send(embed)];
                case 1:
                    embedMessage = _a.sent();
                    _i = 0, emojiList_1 = emojiList;
                    _a.label = 2;
                case 2:
                    if (!(_i < emojiList_1.length)) return [3 /* break */, 5];
                    emoji = emojiList_1[_i];
                    return [4 /* yield */, embedMessage.react(emoji)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /* break */, 2];
                case 5:
                    filter = function(reaction, user) {
                        return emojiList.includes(reaction.emoji.name) && !user.bot;
                    };
                    collector = embedMessage.createReactionCollector(filter, {
                        idle: 600000,
                        dispose: true,
                    });
                    collector.on('collect', (r) => {
                        page = updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams);
                    });
                    collector.on('remove', (r) => {
                        page = updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams);
                    });
                    return [2];
                }
            });
        });
    };
    return DynamicEmbed;
}());
module.exports = DynamicEmbed;
