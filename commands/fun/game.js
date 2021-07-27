module.exports = {
    name: "game",
    cooldown: 3,
    description: "A little Connect 4 game!",
    async execute(message) {
        const Discord = require("discord.js");

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
                let array = this.coordinate.split("");
                let x = array[0];
                let y = array[1];
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

        function draw(squares, coordinate, round, board) {
            let [x, y] = squares[coordinate].pixel();
            board[+y - 1][+x - 1] = round.emoji;
            return board;
        }

        function stringify(board) {
            var result = "";
            for (let i = 0; i < 6; i++) {
                var sub = "";
                for (let j = 0; j < 7; j++) {
                    sub += board[i][j];
                }
                result += sub + "\n";
            }
    
            return result;
        }

        function createEmbed(round, board) {
            let boardStr = stringify(board);
            let embed = new Discord.MessageEmbed()
                .setTitle("**CONNECT FOUR**")
                .setDescription(`It's now ${round.name}'s turn!\n${boardStr}`)
                .setColor("#ff0000");
            return embed;
        }
        
        function doMove(r, embedMessage, round) {
            let [win, coordinate] = place(
                reactCol[r.emoji.name],
                round,
                squares
            );
            let board = draw(squares, coordinate, round, board);
            if (win) {
                collector.stop();
                message.channel.send(
                    `${round.name} had won the game!`
                );
            }
            if (round.name === "red") {
                round.name = "yellow";
                round.emoji = "🟡";
            } else {
                round.name = "red";
                round.emoji = "🔴";
            }
            let editedEmbed = createEmbed(round, board);
            embedMessage.edit(editedEmbed);
            return round;
        }

        function checkWin(d, r, s) {
            let win = false;
            let spaces = [];
            for (let [coordinate, square] of Object.entries(s)) {
                if (square.isOccupied === r.name) {
                    spaces.push(coordinate);
                }
            }
            for (let c of spaces) {
                if (
                    spaces.includes(String(+c + +d)) &&
                    spaces.includes(String(+c + 2 * +d)) &&
                    spaces.includes(String(+c + 3 * +d))
                ) {
                    win = true;
                    break;
                }
            }
            return win;
        }

        //a function to place new piece
        function place(column, round, squares) {
            let placed = false;
            let coordinate = "";
            for (var i = 6; i > 0; i--) {
                coordinate = (column * 10 + i).toString();
                let square = squares[coordinate];
                if (square.isOccupied !== "white") {
                    // pass
                } else {
                    // say this is Blue’s turn
                    // round refers to Blue's turn
                    square.isOccupied = round.name;
                    placed = true;
                    break;
                }
            }
            //if a new disc can’t be placed in this column
            if (!placed) {
                return message.channel.send("You can’t place the disc here!");
            } else {
                let directions = [11, 1, 9, 10, -11, -1, -9, -10];
                for (let direction of directions) {
                    if (checkWin(direction, round, squares)) {
                        return [true, coordinate];
                    }
                }
                return [false, coordinate];
            }
        }

        function drawBoard(sizeX, sizeY) {
            let board = [];
            for (let y = 0; y < sizeY; y++) {
                let column = [];
                for (let x = 0; x < sizeX; x++) {
                    column.push("⚪");
                }
                board.push(column);
            }
            return board;
        }

        function setCoordinates(x, y) {
            let coordinates = [];
            let xList = Array.from({length: x}, (_, i) => i + 1);
            let yList = Array.from({length: y}, (_, i) => i + 1);
            xList.forEach((corX) => {
                yList.forEach((corY) => {
                    coordinates.push(corX + corY);
                });
            });
            return coordinates;
        }

        let coordinates = setCoordinates(7, 6);
        let squares = {};
        coordinates.forEach((coordinate) => {
            var square = new Square("white", coordinate);
            squares[coordinate] = square;
        });
        let board = drawBoard(7, 6);

        const reactCol = {
            "1️⃣": 1,
            "2️⃣": 2,
            "3️⃣": 3,
            "4️⃣": 4,
            "5️⃣": 5,
            "6️⃣": 6,
            "7️⃣": 7,
        };
        const emojiList = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

        let round = {
            "name": "red",
            "emoji": "🔴"
        };

        let embed = createEmbed(round, board);
        let embedMessage = await message.channel.send(embed);
        for (let emoji of emojiList) {
            await embedMessage.react(emoji);
        }
        const filter = (reaction, user) =>
            emojiList.includes(reaction.emoji.name) && !user.bot;
        const collector = embedMessage.createReactionCollector(filter, {
            idle: 600000,
            dispose: true,
        });
        collector.on("collect", (r) => {
            round = doMove(r, embedMessage, round);
        });
        collector.on("remove", (r) => {
            round = doMove(r, embedMessage, round);
        });
    },
};
