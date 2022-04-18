import * as fs from 'fs';

class Util {
    public static readFile(path: fs.PathOrFileDescriptor) {
        const buffer = fs.readFileSync('./data/snipes.json', 'utf-8');
        return JSON.parse(buffer);
    }
}