const fs = require('fs').promises;
const path = require('path');
const playerSchema = require('./playerSchema');

const PLAYER_FILE = path.join(__dirname, 'data', 'players', '0000-0999.json');

// Ensure the player file exists
async function ensureFileExists() {
  try {
    await fs.access(PLAYER_FILE);
  } catch {
    await fs.mkdir(path.dirname(PLAYER_FILE), { recursive: true });
    await fs.writeFile(PLAYER_FILE, '{}', 'utf8');
    console.log('Created missing player file');
  }
}

// Load the entire JSON chunk
async function loadChunk() {
  await ensureFileExists();
  const raw = await fs.readFile(PLAYER_FILE, 'utf8');
  return JSON.parse(raw);
}

// Save the entire JSON chunk
async function saveChunk(chunkData) {
  await fs.writeFile(PLAYER_FILE, JSON.stringify(chunkData, null, 2), 'utf8');
}

// Load or create a single player
async function loadPlayer(userId) {
  const chunk = await loadChunk();

  if (!chunk[userId]) {
    console.log(`Adding new user ${userId}`);
    chunk[userId] = { ...playerSchema };
    await saveChunk(chunk);
    chunk[userId].justCreated = true; // Flag new user
  } else {
    console.log(`User ${userId} already exists`);
    // Merge any new keys from schema to existing player
    let updated = false;
    for (const key of Object.keys(playerSchema)) {
      if (!(key in chunk[userId])) {
        chunk[userId][key] = playerSchema[key];
        updated = true;
      }
    }
    if (updated) await saveChunk(chunk);
    chunk[userId].justCreated = false;
  }

  return chunk[userId];
}

// Update a single player
async function updatePlayer(userId, newData) {
  const chunk = await loadChunk();

  if (!chunk[userId]) {
    chunk[userId] = { ...playerSchema };
  }

  chunk[userId] = { ...chunk[userId], ...newData };
  await saveChunk(chunk);

  return chunk[userId];
}

module.exports = { loadPlayer, updatePlayer };
