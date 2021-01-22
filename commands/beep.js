module.exports = {
	name: 'beep',
	description: 'Beep!',
	execute(message, args) {
		array = ["764840462707326986", "765525905807769621", "765176655407874081", "766636820066074656", "768430617733496842"]
		array.forEach(ID =>{
			message.channel.send(ID)
		})
	},
};