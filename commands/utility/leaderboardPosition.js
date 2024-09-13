// Gets the players position on the leaderboard
import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

const data = new SlashCommandBuilder()
	.setName('candy_leaderboard_position')
	.setDescription('Gets the User\'s leaderboard position');

async function execute(interaction) {
	// Get all the relevant data
	const data = JSON.parse(fs.readFileSync('./commands/resources/users.json'));

	let usersArr = Object.entries(data);
	// Sort usersArray
	usersArr = usersArr.map(x => [x[1].globalName, x[1].candy])
		.sort((a, b) => b[1] - a[1])

	// TOOD: Find the user's leadebroard position
	let pos = usersArr.findIndex(item => item[0] == interaction.user.globalName);
	if (pos >= 0) {
		await interaction.reply(`User ${interaction.user.globalName} is position ${pos + 1} on the candy leaderboard`);
	} else {
		await interaction.reply(`User ${interaction.user.globalName} not on the candy leaderboard. Please sign up by collecting candy`);
	}
}

export { data, execute }