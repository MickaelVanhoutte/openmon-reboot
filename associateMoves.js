import fs from "fs";
import basePokedex from "./base-pokedex.json" assert { type: "json" };
import moveAssociations from "./move-associations2.json" assert { type: "json" };

// Merge data based on Pokémon ID
const mergedData = basePokedex.map((pokemon) => {
  //console.log(moveAssociations.filter(assoc => assoc.pokemon_id === pokemon.id));
  const moves =
    moveAssociations.filter((assoc) => assoc.pokemon_id === pokemon.id) || [];
  console.log({
    ...pokemon,
    moves: moves.map((move) => {
      return { ...move.move, level: move.level };
    }),
  });
  return {
    ...pokemon,
    moves: moves.map((move) => {
      return { ...move.move, level: move.level };
    }),
  };
});

// Write the merged data to base-pokedex-moves.json
fs.writeFileSync(
  "./base-pokedex-moves.json",
  JSON.stringify(mergedData),
  "utf8",
);

console.log("Merged data has been written to base-pokedex-moves.json");
