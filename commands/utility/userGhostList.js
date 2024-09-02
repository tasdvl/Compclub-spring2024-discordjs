const { SlashCommandBuilder } = require('discord.js');
const { getUserCollection } = require('../../ghost-info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userghostlist')
		.setDescription("Returns a list of this user's claimed ghosts")
        .addUserOption(option => 
            option.setName('user')
            .setDescription('the user whose list to show')
            .setRequired(true)),
    
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        if (!user) {
            await interaction.reply('The user cannot be found!');
        } 

        const collection = getUserCollection(user.id) || [];
        let descriptionMsg;

        if (collection.length == 0) {
            descriptionMsg = "This user does not have ghosts yet!";
        } else {
            descriptionMsg = collection.map(g => g.name).join('\n');
        }

        const ghostEmbed = {
            title: `${user.username}'s collection`,
            color: 0x0099FF,
            description: descriptionMsg,
            thumbnail: {
                url: user.displayAvatarURL({dynamic: true})
            }
        }

		await interaction.reply({
            embeds: [ghostEmbed]
        });
	},
};