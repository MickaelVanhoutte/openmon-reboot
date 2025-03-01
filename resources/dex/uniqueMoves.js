import fs from "fs";
import basePokedex from "./base-pokedex-moves.json" assert { type: "json" };

// Create a set to store unique moves
const uniqueMovesSet = new Set();

// Process each move and add it to the set
basePokedex.forEach((pokemon) => {
  const { moves } = pokemon;
  moves.forEach((move) => {
    const { id, name, type, power, accuracy, pp, effect, priority, target } =
      move;
    const moveKey = JSON.stringify({
      id,
      name,
      type,
      power,
      accuracy,
      pp,
      effect,
      priority,
      target,
    });
    uniqueMovesSet.add(moveKey);
  });
});

// Convert the set back to an array of move objects
const uniqueMovesArray = Array.from(uniqueMovesSet).map((moveKey) =>
  JSON.parse(moveKey),
);

// sort by move id
uniqueMovesArray.sort((a, b) => a.id - b.id);

// check if ids are missing
let missingIds = false;
uniqueMovesArray.forEach((move, index) => {
  if (move.id !== index + 1) {
    console.log(`Missing move ID: ${index + 1}`);
    missingIds = true;
  }
});

// Write the unique moves to all-moves.json
fs.writeFileSync(
  "./all-moves.json",
  JSON.stringify(uniqueMovesArray, null, 2),
  "utf8",
);

console.log("Unique moves have been written to all-moves.json");
