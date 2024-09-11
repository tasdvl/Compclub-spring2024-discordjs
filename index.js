const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { token } = require('./config.json');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// YOUR CODE GOES HERE:  /////////////////////////////////////////////////////////////////////////

// function to generate a random delay between min and max minutes
function getRandomDelayInMinutes(min, max) {
    // Convert minutes to milliseconds
    const minMillis = min * 60 * 1000;
    const maxMillis = max * 60 * 1000;
    return Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
}

async function jumpscare(oldState, newState) {
    // check if the bot itself is joining the channel
    if (newState.member.user.id === client.user.id) {
        return; 
    }

    // check if any user has joined a voice channel
    if (!oldState.channelId && newState.channelId) {
        // generate the random delay
        const delay = getRandomDelayInMinutes(0, 10);

        console.log(`User ${newState.member.user.tag} joined a voice channel. Waiting for ${delay / (60 * 1000)} minutes.`);

        // wait asynchronously for the random delay
        await new Promise(resolve => setTimeout(resolve, delay));

        // get the voice channel that the user joined
        const voiceChannel = newState.guild.channels.cache.get(newState.channelId);
 
        if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
            try {
                // join the voice channel
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                connection.on(VoiceConnectionStatus.Ready, () => {
                    console.log(`Successfully connected to ${voiceChannel.name}`);
                });

                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    console.log(`Disconnected from ${voiceChannel.name}`);
                });

                // create an audio player
                const player = createAudioPlayer();
                
                // create an audio resource with volume set to 1.0 (maximum volume)
                const resource = createAudioResource('audio/jumpscare.mp3', {
                    inlineVolume: true // enables volume control
                });

                // set the volume to maximum
                resource.volume.setVolume(1.0);

                player.play(resource);
                connection.subscribe(player);

                // handle audio player events
                player.on(AudioPlayerStatus.Idle, () => {
                    console.log('Jumpscare finished.');
                    connection.destroy(); // disconnect after playback
                });

                player.on('error', (error) => {
                    console.error('Error playing audio:', error);
                    connection.destroy(); // disconnect if an error occurs
                });

            } catch (error) {
                console.error('Error connecting to the voice channel:', error);
            }
        } else {
            console.log('The selected channel is not a voice channel or not found.');
        }
    }
}


// Register the voiceStateUpdate event listener
client.on('voiceStateUpdate', jumpscare);
/////////////////////////////////////////////////////////////////////////////////////////////////////


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);