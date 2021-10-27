import * as fuzzysort from "fuzzysort";
import { Message } from "discord.js";

interface MemberInfo {
    nickname: string;
    username: string;
    tag: string;
    discriminator: string;
}

interface Options {
    keys?: string[];
    limit?: number;
}

class FuzzySort{
    message: Message;
    array: object[];
    constructor(message: Message, searchArray?: object[]) {
        this.message = message;
        this.array = searchArray;
        if (!this.array) {
            this.array = this.message.guild.members.cache.map((member) => {
                let memberInfo : MemberInfo = {
                    nickname: member.displayName,
                    username: member.user.username,
                    tag: member.user.tag,
                    discriminator: member.user.discriminator
                };
                return memberInfo;
            });
        }
    }
    // search a keyword
    search(keyword: string, options: Options = {}) {
        let { keys = ["nickname", "username", "tag", "discriminator"], limit = 1 } = options;
        let result = fuzzysort.go(keyword, this.array, {
            keys,
            limit,
        });
        if (!result[0]) return;
        let member = this.message.guild.members.cache.find((m) => m.user.tag === result[0].obj["tag"]);
        return member;
    }
}
module.exports = FuzzySort;