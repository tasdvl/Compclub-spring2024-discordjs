import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

const data = new SlashCommandBuilder()
	.setName('tell_joke')
	.setDescription('Tells a very good joke');

async function execute(interaction) {
	const jokesJson = fs.readFileSync('./commands/resources/joke.json', {flag: 'r'});
	const jokes = JSON.parse(jokesJson).jokes;
	const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
	await interaction.reply(randomJoke);
}

export { data, execute }