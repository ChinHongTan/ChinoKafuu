module.exports = {
    name: 'board',
    cooldown: 3,
	description: 'Test board function!',
	execute(client, message, args) {
        const Canvas = require('canvas');
        const Discord = require('discord.js');
        const newLocal = 'imgbb-uploader';
        const imgbbUploader = require(newLocal);

        // a class of a single square on the board
        class Square {
            // occupied can be blue, red or null (not occupied)
            // coordinate refers to A1, B2, C3, etc.
            constructor(occupied, coordinate) {
                this.occupied = occupied;
                this.coordinate = coordinate;
            };
            // calculate where to draw the coloured discs
            pixel(width, height)  {
                let array = this.coordinate.split('');
                x = (array[0] - 0.5) * width / 7;
                y = (array[1] - 0.5) * height / 6; 
                return [x, y];
            };
            // whether this square had been occupied
            get isOccupied() {
                return this.occupied;
            };
            set isOccupied(round) {
                this.occupied = round;
            };
        };

        //a function to place new coloured discs
        function place(column, round, squares) {
            let placed = false
            let coordinate = '';
            for (var i = 6; i > 0; i--) {
                coordinate = (column * 10 + i).toString();
                let square = squares[coordinate]
                if (square.isOccupied != 'white') {
                    // pass
                } else {
                    // say this is Blue’s turn
                    // round refers to Blue's turn
                    square.isOccupied = round;
                    placed = true;
                    break;
                };
            };
            //if a new disc can’t be placed in this column
            if (!placed) {
                return message.channel.send("You can’t place the disc here!");
            } else {
                let directions = [11, 1, 9, 10, -11, -1, -9, -10];
                for ( let direction of directions ) {
                    let win = checkWin(direction, round, squares);
                    if (win == true) return [win, coordinate];
                };
                return [win, coordinate];
            };
        };

        function checkWin(d, r, s) {
            let win = false;
            let spaces = [];
            for (let [coordinate, square] of Object.entries(s)) {
                if (square.isOccupied == r) {
                    spaces.push(coordinate);
                };
            };
            for ( let c of spaces ) {
                if (spaces.includes(String(+c + +d)) && spaces.includes(String(+c + 2 * +d)) && spaces.includes(String(+c + 3 * +d))) {
                    win = true;
                    break;
                };
            };
            return win;
        };

        async function draw(squares, coordinate, round) {
            return new Promise((resolve, reject) => {
                [x, y] = squares[coordinate].pixel(700, 600);
                context.beginPath();
                context.arc(x, y, 40, 0, 2 * Math.PI);
                context.fillStyle = round;
                context.fill();
                getImageUrl(canvas.toBuffer(), coordinate).then( url => {
                    resolve(url);
                });
            });
        };

        function createEmbed(round, url) {
            let embed = new Discord.MessageEmbed()
            .setTitle("**CONNECT FOUR**")
            .setDescription(`It's now ${round}'s turn!`)
            .setColor('#ff0000')
            .setImage(url);
            return embed;
        };

        async function getImageUrl(buffer, coordinate) {
            return new Promise((resolve, reject) => {
                let url = '';
                const options = {
                    apiKey: "dd9b7c075a7603838dcc33e0e9ed1475", // MANDATORY
        
                    name: `connect-four-board${coordinate}.png`, // OPTIONAL: pass a custom filename to imgBB API
        
                    base64string: buffer.toString('base64'),
                };
                imgbbUploader(options)
                    .then((response) => {
                        url = response.url;
                        resolve(url);
                    })
                    .catch((error) => console.error(error));
            });
        };

        const canvas = Canvas.createCanvas(700, 600);
        const context = canvas.getContext('2d');

        //draws a 700 x 600 blue rectangle
        context.fillStyle = 'blue';
        context.fillRect(0, 0, canvas.width, canvas.height);

        let combos = [];
        let x = ['1', '2', '3', '4', '5', '6', '7'];
        let y = ['1', '2', '3', '4', '5', '6'];
        x.forEach( corX =>{
            y.forEach( corY =>{
                combos.push(corX + corY);
            });
        });
        let squares = {};
        combos.forEach( coordinate => {
            var square = new Square("white", coordinate);
            [corX, corY] = square.pixel(700, 600);
            squares[coordinate] = square;
            context.beginPath();
            context.arc(corX, corY, 40, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
        });

        const reactCol = {
            "1️⃣" : 1, 
            "2️⃣" : 2,
            "3️⃣" : 3,
            "4️⃣" : 4,
            "5️⃣" : 5,
            "6️⃣" : 6,
            "7️⃣" : 7
        };

        let round = "red";
        let coordinate = "00";
        let win = false;

        getImageUrl(canvas.toBuffer(), coordinate).then( url => {
            embed = createEmbed(round, url);
            message.channel.send(embed).then( embedMessage => {
                embedMessage.react('1️⃣')
                .then(embedMessage.react('2️⃣'))
                .then(embedMessage.react('3️⃣'))
                .then(embedMessage.react('4️⃣'))
                .then(embedMessage.react('5️⃣'))
                .then(embedMessage.react('6️⃣'))
                .then(embedMessage.react('7️⃣'));
                const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'].includes(reaction.emoji.name) && !user.bot;
                const collector = embedMessage.createReactionCollector(filter, { idle: 600000, dispose: true });
                collector.on('collect', r => {
                    [win, coordinate] = place(reactCol[r.emoji.name], round, squares);
                    draw(squares, coordinate, round)
                    .then( url => {
                        let editedEmbed = createEmbed(round, url);
                        embedMessage.edit(editedEmbed);
                    });
                    if (win) {
                        collector.stop();
                        return message.channel.send(`${round} had won the game!`);
                    };
                    if (round == 'red') {
                        round = 'yellow';
                    } else round = 'red';
                });
                collector.on('remove', r => {
                    [win, coordinate] = place(reactCol[r.emoji.name], round, squares);
                    draw(squares, coordinate, round)
                    .then( url => {
                        let editedEmbed = createEmbed(round, url);
                        embedMessage.edit(editedEmbed);
                    });
                    if (win) {
                        collector.stop();
                        return message.channel.send(`${round} had won the game!`);
                    };
                    if (round == 'red') {
                        round = 'yellow';
                    } else round = 'red';
                });
            });
        });
	},
};
