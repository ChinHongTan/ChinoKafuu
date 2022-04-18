"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Util {
    static readFile(path) {
        const buffer = fs.readFileSync('./data/snipes.json', 'utf-8');
        return JSON.parse(buffer);
    }
}
//# sourceMappingURL=Util.js.map