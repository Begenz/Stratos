const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/players.json');

let players = {};

function loadData() {
  if (fs.existsSync(filePath)) {
    players = JSON.parse(fs.readFileSync(filePath));
  }
}

function saveData() {
  fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
}

const defaultPlayer = {
  coins: 0,
  bank: 0
};

function getPlayer(userId) {
  let player = players[userId];

  if (!player) {
    player = { ...defaultPlayer };
    players[userId] = player;
  } else {
    for (const key in defaultPlayer) {
      if (!(key in player)) {
        player[key] = defaultPlayer[key];
      }
    }

    for (const key in player) {
      if (!(key in defaultPlayer)) {
        delete player[key];
      }
    }
  }

  saveData();
  return player;
}

module.exports = { getPlayer, saveData, loadData };
