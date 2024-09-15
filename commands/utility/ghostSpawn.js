import { SlashCommandBuilder, ReactionCollector } from 'discord.js';
import { getGhostTypes, getRandomGhost, generateImageUrl, getImageAttachment } from '../../ghost-utility.js';
import { claimGhost, getGhostOwnerID } from '../../ghost-info.js';

export const data = new SlashCommandBuilder()
		.setName("ghostrandom")
		.setDescription("Spawns a random ghost :D");

export async function execute(interaction) {
    // part 1: spawning the ghost ------------------------------------------

    // TODO: implement this function :)

    /* We recommend following the steps listed - though feel free to 
       implement it your own way if you want!
       Remember to look through ghost-info and ghost-utility to see if
       there are any functions that could help you
    */

    // 1. Generate a random ghost to be posted

    // 2. Create an embed to send the ghost to the discord channel.
    // this should include the ghost's name, its image, its rarity and types,
    // and a footer. (Play around with the bot on the CompClub discord
    // for details on what to put in these fields.)

    // 3. Send the embed to the discord channel


    // part 2: handling the reacts ------------------------------------------

    // 1. Create a new reaction collector to grab message reacts

    // 2. Add the ghost to a user's claimed ghosts if they react to an 
    // unclaimed ghost - if it is already claimed then it should respond with
    // a fitting error message.
}