import { Events } from "discord.js";

import { 
  checkHealth, 
  attackMonster, 
  wordExists, 
  checkRule, 
  getAttackMessage, 
  checkMuted 
} from './utils/service.js';

const name = Events.MessageCreate;

/**
 * Listen to messages. Will run everytime a new message is sent by any user in the server
 * This part of the code is responsible for handling messages
 * NOTE: This bot will only listen to messages in the 'general' channel
 */
async function execute(message) {
  if (message.author.bot) return; // If the message is sent by a bot, do not process it
	if (checkHealth() <= 0) return; // If the monster is already dead, do not process any more messages
	if (message.channel.name !== 'general') return; // If the message is not sent in the 'general' channel, do not process it

	console.log("--> " + message.content);
	const originalContent = message.content;

	// Split the message into separate words
	const words = originalContent.split(" ");

	let damage = 0;

	// Check each word if it is valid
	for (const word of words) {
		try {
			if (checkRule(word) && wordExists(word)) {
				console.log(`The word "${word}" is valid.`);
				damage += word.length; // If valid, add the length of the word as damage
			} else {
				if (!wordExists(word)) {
					console.log(`The word "${word}" does not exist in the English dictionary.`);
					// Note that we are using a predefined library of words, so new words might not be included
					// TODO: Improve this by using a more comprehensive dictionary
				} else {
					console.log(`The word "${word}" is invalid.`);
					// This happens when the word breaks one or two of the rules
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	// If any of the words are valid, attack the monster
	if (damage > 0) {
		console.log(`Total damage: ${damage}`);
		attackMonster(damage);
		console.log(`Current health: ${checkHealth()}`);

		if (!checkMuted()) {
			message.reply(getAttackMessage(damage));
		}
		// ADDITIONAL FEATURE: Create a tracking feature that tracks each persons damage dealt per day
	}

	// Check if the monster is dead or not
	const currentHealth = checkHealth();
	const guild = client.guilds.cache.get(guildId);
	const generalChannel = guild.channels.cache.find(channel => channel.name === 'general');
	if (currentHealth <= 0) {
		generalChannel.send(` \`\`\`
 ,-=-.  
/  +  \\    
| ~~~ |    
|R.I.P|  
|_____|
			\`\`\` `);
		generalChannel.send(`Good job! Vorazk has been defeated! But beware, he will return soon! 🧛‍♂️`);
	}
}

export default { name, execute };