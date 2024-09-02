const { AttachmentBuilder } = require('discord.js');
const { dataStore, getNameFromGhost } = require('./ghosts-index');
const path = require('path');

/* ----------------------------------------------------------------------------

Hi Programmer! This file contains some utility functions for building your 
ghost collector bot. Note that you don't need to understand how any of these 
functions actually work! You  only need to worry about their given description
and be able to use them accordingly in other files. If you are curious about
written code, ask a mentor! :D

-----------------------------------------------------------------------------*/

// randomly generates a ghost - rarer ghosts are less likely to appear!
// returns a Ghost (has a name, image, rarity etc)
function getRandomGhost() {
    let totalWeight = 0;
    const cumulative = [];

    let ghosts = dataStore.GhostsIndex;

    ghosts.forEach(g => {
        totalWeight += 1 / g.rarity;
        cumulative.push(totalWeight);
    });

    const rand = Math.random() * totalWeight;

    for (let i = 0; i < cumulative.length; i++) {
        if (rand < cumulative[i]) {
            return ghosts[i];
        }
    }
}

// gets the types of the given ghost as a string - useful for discord embed
function getGhostTypes(ghost) {
    return ghost.types.map(type => getNameFromGhost[type]).join(", ");
}

// creates an attachment from the ghost's supplied image - useful for discord embed
function getImageAttachment(ghost) {
    const imagePath = 
        path.join(__dirname + "/commands/utility", '..', '..', ghost.image_url);
    return new AttachmentBuilder(imagePath);
}

// creates an embeddable url from the ghost's supplied image 
// useful for discord embed
function generateImageUrl(ghost) {
    const imagePath = 
        path.join(__dirname + "/commands/utility", '..', '..', ghost.image_url);
    return `attachment://${path.basename(imagePath)}`
}

module.exports = {
    getRandomGhost,
    getGhostTypes,
    getImageAttachment,
    generateImageUrl
}
