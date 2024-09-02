const { SlashCommandBuilder, ReactionCollector } = require('discord.js');
const { getGhostTypes, getRandomGhost, generateImageUrl, getImageAttachment } = require('../../ghost-utility');
const { claimGhost, getGhostOwnerID } = require('../../ghost-info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ghostrandom")
		.setDescription("Spawns a random ghost :D"),
	async execute(interaction) {

        // part 1: spawning the ghost ------------------------------------------

        let ghost = getRandomGhost();
        let owner = getGhostOwnerID();
        let footerText;

        if (owner === "") {
            footerText = "react with any emoji to claim!"
        } else {
            footerText = `claimed by ${client.users.fetch(owner).username}`
        }

        const ghostEmbed = {
            title: ghost.name,
            color: 0x0099FF,
            image: { url: generateImageUrl(ghost)},
            fields: [
                { name: 'Rarity', value: ghost.rarity.toString() + "/5", inline: true },
                { name: 'Types', value: getGhostTypes(ghost), inline: true },
            ],
            footer: { 
                text: footerText
            }
        }

		const msg = await interaction.reply({
            embeds: [ghostEmbed],
            files: [getImageAttachment(ghost)],
            fetchReply: true
        });

        // part 2: handling the reacts ------------------------------------------

        const collectorFilter = (reaction, user) => {
            return user.id === message.author.id;
        };

        const reactCollector = msg.createReactionCollector({ filter: collectorFilter, max: 1 })

        reactCollector.on('collect', (reaction, user) => {
            console.log('ghost collected!')
            if (claimGhost(user.id, ghost)) {
                interaction.followUp(`${user.username} has claimed ${ghost.name}!`)
            } else {
                interaction.followUp(`oops! this ghost has already been claimed`)
            }
        });
	},
};