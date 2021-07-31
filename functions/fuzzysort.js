"use strict";
exports.__esModule = true;
var fuzzysort = require("fuzzysort");
var FuzzySort = /** @class */ (function () {
    function FuzzySort(message, searchArray) {
        this.message = message;
        this.array = searchArray;
        if (!this.array) {
            this.array = this.message.guild.members.cache.map(function (member) {
                var memberInfo = {
                    nickname: member.displayName,
                    username: member.user.username,
                    tag: member.user.tag,
                    discriminator: member.user.discriminator
                };
                return memberInfo;
            });
        }
    }
    FuzzySort.prototype.search = function (keyword, options) {
        if (options === void 0) { options = {}; }
        var _a = options.keys, keys = _a === void 0 ? ["nickname", "username", "tag", "discriminator"] : _a, _b = options.limit, limit = _b === void 0 ? 1 : _b;
        var result = fuzzysort.go(keyword, this.array, {
            keys: keys,
            limit: limit
        });
        if (!result[0])
            return undefined;
        var member = this.message.guild.members.cache.find(function (m) { return m.user.tag === result[0].obj["tag"]; });
        return member;
    };
    return FuzzySort;
}());
module.exports = FuzzySort;
