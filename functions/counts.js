module.exports = {
    name: 'count',
    func(message) {
        const fs = require('fs');

        const rawData = fs.readFileSync('../data/countingData.json');
        const countingData = JSON.parse(rawData);
        if (!Number(message.content)) return;
        if (countingData.counter === '0' || !countingData.counter) {
            if (message.content !== '1') return;
            countingData.author = message.author.tag;
            countingData.counter = message.content;
            const data = JSON.stringify(countingData, null, 2);
            fs.writeFileSync('../data/countingData.json', data);
            message.react('✅');
            return;
        }
        if (message.author.tag !== countingData.author) {
            if (message.content !== Number(countingData.counter) + 1) {
                countingData.counter = '0';
                countingData.author = '';
                const data = JSON.stringify(countingData, null, 2);
                fs.writeFileSync('../data/countingData.json', data);
                message.react('❌');
            }
            else {
                countingData.counter = message.content;
                countingData.author = message.author.tag;
                const data = JSON.stringify(countingData, null, 2);
                fs.writeFileSync('../data/countingData.json', data);
                message.react('✅');
            }
        }
    },
};
