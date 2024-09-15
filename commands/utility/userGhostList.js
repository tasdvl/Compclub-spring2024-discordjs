import { SlashCommandBuilder } from 'discord.js';
import { getUserCollection } from '../../ghost-info.js';

export const data = new SlashCommandBuilder()
		.setName('userghostlist')
		.setDescription("Returns a list of this user's claimed ghosts")
        // TODO: allow this command to take in a username as an additional parameter
    
export async function execute(interaction) {

    // TODO: implement this function

    // 1. get the user's collection, and print out all of them.
    // you may want to look at js' .join() function for help
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    
    // 2. put the printed out list into an embed, and send the embed

}