const fs = require('fs').promises;
const path = require('path');
const playerSchema = require('./playerSchema');

const PLAYER_FILE = path.join(__dirname, 'data', 'players', '0000-0999.json');

// Ensure the file exists
async function ensureFileExists() {
    try {
        await fs.access(PLAYER_FILE);
    } catch {
        // Create empty JSON if missing
        await fs.mkdir(path.dirname(PLAYER_FILE), { recursive: true });
        await fs.writeFile(PLAYER_FILE, '{}', 'utf8');
        console.log('Created missing player file');
    }
}

// Load the entire chunk
async function loadChunk() {
    await ensureFileExists();
    const raw = await fs.readFile(PLAYER_FILE, 'utf8');
    console.log('Raw JSON from file:', raw);
    return JSON.parse(raw);
}

// Save the entire chunk
async function saveChunk(chunkData) {
    await fs.writeFile(PLAYER_FILE, JSON.stringify(chunkData, null, 2), 'utf8');
    console.log('Chunk saved:', chunkData);
}

// Load or create a single player
async function loadPlayer(userId) {
    const chunk = await loadChunk();

    if (!chunk[userId]) {
        console.log(`Adding new user ${userId}`);
        chunk[userId] = { ...playerSchema };
        await saveChunk(chunk);
    } else {
        console.log(`User ${userId} already exists`);
    }

    return chunk[userId];
}

// Update a single player
async fun
