import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

const data = new SlashCommandBuilder()
	.setName('candy_leaderboard')
	.setDescription('Gets a leaderboard of the top 5 people with the most Candy');

async function execute(interaction) {
	// Get all the relevant data
	const data = JSON.parse(fs.readFileSync('./commands/resources/users.json'));

	let usersArr = Object.entries(data);
	// Sort usersArray
	usersArr = usersArr.map(x => [x[1].globalName, x[1].candy])
		.sort((a, b) => b[1] - a[1])
	if (usersArr.length >= 5) {
		usersArr = usersArr.slice(0, 5);
		// manipulate usersArray to be less than 5
	}
	let leaderboardMsg = "====== Top Candy Owners =========="
	for (const [index, element] of usersArr.entries()) {
		leaderboardMsg += `\n **${index + 1}** - ${element[0]} - ${element[1]} Candy}`
	}
	await interaction.reply(leaderboardMsg);
}

export { data, execute }