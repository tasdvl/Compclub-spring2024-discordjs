// this array holds a list of objects that look like
/*
    {
        ID: the user ID
        ghosts: [] an array of all the ghosts the user has
    }
*/
export const userClaims = [];

// given a ghost, adds the ghost to a list of the user's
// collected ghosts. Should return true if it succeeds and
// false if someone else already owns that ghost
export function claimGhost(userId, ghost) {
    // TODO
}

// should return an array of all the ghosts a user owns,
// or [] if they don't own any
export function getUserCollection(userId) {
    // TODO
}

// returns the user ID of the ghost's owner, and if the
// ghost is unclaimed then just returns ""
export function getGhostOwnerID(ghostName) {
    // TODO
}