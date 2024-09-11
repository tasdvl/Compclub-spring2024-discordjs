# ur ur ur ur

## Setup
Make sure you have the GUILD_VOICE_STATES intent enabled in your bot configuration and in the Discord Developer Portal.
Enable all three privileged gateway intents

do "npm install discord.js @discordjs/voice" to install the voice package
also "npm install @discordjs/opus" (audio encoder and decoder)
also "npm install sodium-native" (encryption of voice data)
also run "sudo apt install ffmpeg" (linux only)

download an audio file of your choosing (I used the fnaf 1 jumpscare noise), name it jumpscare.mp3 and place it in a folder
called audio (which goes in the base directory)

at start, import new functions from discord.js, adding VoiceConnectionStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus.
also adding channelType to the requires from discord.js


```
const { Client, Collection, Events, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
```
first, modify your const client so:

```
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });
```

then
```
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
```