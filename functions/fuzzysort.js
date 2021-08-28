exports.__esModule = true;
const fuzzysort = require('fuzzysort');

const FuzzySort = /** @class */ (function() {
    function FuzzySort(message, searchArray) {
        this.message = message;
        this.array = searchArray;
        if (!this.array) {
            this.array = this.message.guild.members.cache.map((member) => {
                const memberInfo = {
                    nickname: member.displayName,
                    username: member.user.username,
                    tag: member.user.tag,
                    discriminator: member.user.discriminator,
                };
                return memberInfo;
            });
        }
    }
    FuzzySort.prototype.search = function(keyword, options) {
        if (options === void 0) {
            options = {};
        }
        const _a = options.keys; const keys = _a === void 0 ? ['nickname', 'username', 'tag', 'discriminator'] : _a; const _b = options.limit; const limit = _b === void 0 ? 1 : _b;
        const result = fuzzysort.go(keyword, this.array, {
            keys,
            limit,
        });
        if (!result[0]) {
            return;
        }
        const member = this.message.guild.members.cache.find((m) => m.user.tag === result[0].obj.tag);
        return member;
    };
    return FuzzySort;
}());
module.exports = FuzzySort;
