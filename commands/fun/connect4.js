const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed, Message, CommandInteraction } = require('discord.js');

async function connect4(command, language) {
    const coordinates = setCoordinates(7, 6);
    const squares = {};

    const reactCol = {
        '1️⃣': 1,
        '2️⃣': 2,
        '3️⃣': 3,
        '4️⃣': 4,
        '5️⃣': 5,
        '6️⃣': 6,
        '7️⃣': 7,
    };

    // a class of a single square on the board
    class Square {
        // occupied can be blue, red or null (not occupied)
        // coordinate refers to A1, B2, C3, etc.
        constructor(occupied, coordinate) {
            this.occupied = occupied;
            this.coordinate = coordinate;
        }

        // calculate where to draw the piece
        pixel() {
            const array = this.coordinate.split('');
            const x = array[0];
            const y = array[1];
            return [x, y];
        }

        // whether this square had been occupied
        get isOccupied() {
            return this.occupied;
        }

        set isOccupied(name) {
            this.occupied = name;
        }
    }

    coordinates.forEach((coordinate) => {
        squares[coordinate] = new Square('white', coordinate);
    });

    function draw(squaresDict, coordinate, round, board) {
        const [x, y] = squaresDict[coordinate].pixel();
        board[+y - 1][+x - 1] = round.emoji;
        return board;
    }

    function stringify(board) {
        let result = '';
        for (let i = 0; i < 6; i++) {
            let sub = '';
            for (let j = 0; j < 7; j++) {
                sub += board[i][j];
            }
            result += `${sub}\n`;
        }

        return result;
    }

    function createEmbed(round, board) {
        const boardStr = stringify(board);
        return new MessageEmbed()
            .setTitle('**CONNECT FOUR**')
            .setDescription(language.board.replace('${round.name}', round.emoji).replace('${boardStr}', boardStr))
            .setColor('#ff0000');
    }

    function checkWin(d, r, s) {
        let win = false;
        const spaces = [];
        for (const [coordinate, square] of Object.entries(s)) {
            if (square.isOccupied === r.name) {
                spaces.push(coordinate);
            }
        }
        for (const c of spaces) {
            if (
                spaces.includes(String(+c + +d))
                && spaces.includes(String(+c + 2 * +d))
                && spaces.includes(String(+c + 3 * +d))
            ) {
                win = true;
                break;
            }
        }
        return win;
    }

    // a function to place new piece
    function place(column, round, squaresDict) {
        let placed = false;
        let coordinate = '';
        for (let i = 6; i > 0; i--) {
            coordinate = (column * 10 + i).toString();
            const square = squaresDict[coordinate];
            if (square.isOccupied !== 'white') {
                // pass
            } else {
                // say this is Blue’s turn
                // round refers to Blue's turn
                square.isOccupied = round.name;
                placed = true;
                break;
            }
        }
        // if a new piece can’t be placed in this column
        if (!placed) {
            return reply(command, language.invalidMove, 'RED');
        }
        const directions = [11, 1, 9, 10, -11, -1, -9, -10];
        for (const direction of directions) {
            if (checkWin(direction, round, squaresDict)) {
                return [true, coordinate];
            }
        }
        return [false, coordinate];
    }

    function doMove(r, embedMessage, round, collector) {
        const [win, coordinate] = place(
            reactCol[r.emoji.name],
            round,
            squares,
        );
        board = draw(squares, coordinate, round, board);
        if (win) {
            collector.stop();
            if (command instanceof CommandInteraction) return command.followUp({ embeds: [{ description: language.win.replace('${round.name}', round.emoji), color: 'GREEN' }] });
            if (command instanceof Message) return reply(command, language.win.replace('${round.name}', round.emoji), 'GREEN');
        }
        if (round.name === 'red') {
            round.name = 'yellow';
            round.emoji = '🟡';
        } else {
            round.name = 'red';
            round.emoji = '🔴';
        }
        const editedEmbed = createEmbed(round, board);
        embedMessage.edit({ embeds: [editedEmbed] });
        return round;
    }

    function drawBoard(sizeX, sizeY) {
        const board = [];
        for (let y = 0; y < sizeY; y++) {
            const column = [];
            for (let x = 0; x < sizeX; x++) {
                column.push('⚪');
            }
            board.push(column);
        }
        return board;
    }

    function setCoordinates(x, y) {
        const coordinatesList = [];
        const xList = Array.from({ length: x }, (_, i) => i + 1).map(String);
        const yList = Array.from({ length: y }, (_, i) => i + 1).map(String);
        xList.forEach((corX) => {
            yList.forEach((corY) => {
                coordinatesList.push(corX + corY);
            });
        });
        return coordinatesList;
    }

    let board = drawBoard(7, 6);

    const emojiList = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];

    let round = {
        name: 'red',
        emoji: '🔴',
    };

    const embed = createEmbed(round, board);
    const embedMessage = await reply(command, { embeds: [embed] });
    for (const emoji of emojiList) {
        await embedMessage.react(emoji);
    }
    const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
    const collector = embedMessage.createReactionCollector({
        filter,
        idle: 600000,
        dispose: true,
    });
    collector.on('collect', (r) => {
        round = doMove(r, embedMessage, round, collector);
    });
    collector.on('remove', (r) => {
        round = doMove(r, embedMessage, round, collector);
    });
}
module.exports = {
    name: 'connect4',
    cooldown: 3,
    description: true,
    async execute(message, _args, language) {
        await connect4(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            await connect4(interaction, language);
        },
    },
};
