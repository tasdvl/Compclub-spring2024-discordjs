// this array holds a list of objects that look like
/*
    {
        ID: the user ID
        ghosts: [] an array of all the ghosts the user has
    }
*/
const userClaims = [];

// given a ghost, adds the ghost to a list of the user's
// collected ghosts. Should return true if it succeeds and
// false if someone else already owns that ghost
function claimGhost(userId, ghost) {
    if (getGhostOwnerID(ghost.name) === "") {
        user = userClaims.find(u => u.ID === userId);
        if (!user) {
            userClaims.push({ID: userId, ghosts: [ghost]});
        } else {
            user.ghosts.push(ghost);
        }
        return true;
    }
    return false;
}

// should return an array of all the ghosts a user owns,
// or [] if they don't own any
function getUserCollection(userId) {
    user = userClaims.find(u => u.ID === userId);
    if (!user) {
        return [];
    } else {
        return user.ghosts;
    }
}

// returns the user ID of the ghost's owner, and if the
// ghost is unclaimed then just returns ""
function getGhostOwnerID(ghostName) {
    for (user of userClaims) {
        if (user.ghosts.some(g => g.name.toLowerCase() === ghostName.toLowerCase())) {
            return user.ID;
        }
    }
    return "";
}

module.exports = {
    claimGhost,
    getUserCollection,
    getGhostOwnerID
}