// playerManager.js
const fs = require('fs').promises;
const path = require('path');
const playerSchema = require('./playerSchema');

// Path to the local player data file
const PLAYER_FILE = path.join(__dirname, 'data', 'players', '0000-0999.json');

// Load the entire chunk of users
async function loadChunk() {
    try {
        const raw = await fs.readFile(PLAYER_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        // File doesn't exist yet or is empty
        return {};
    }
}

// Save the entire chunk of users
async function saveChunk(chunkData) {
    await fs.writeFile(PLAYER_FILE, JSON.stringify(chunkData, null, 2), 'utf8');
}

// Load a single player (creates a new entry if the user doesn't exist)
async function loadPlayer(userId) {
    const chunk = await loadChunk();

    if (!chunk[userId]) {
        console.log(`Adding new user ${userId}`);
        chunk[userId] = { ...playerSchema };
    }

    await saveChunk(chunk);
    return chunk[userId];
}

// Optional: save/update a single player (merge with schema)
async function savePlayer(userId, playerData) {
    const chunk = await loadChunk();

    // Merge schema defaults with provided player data
    chunk[userId] = { ...playerSchema, ...playerData };

    await saveChunk(chunk);
}

module.exports = { loadPlayer, savePlayer };
