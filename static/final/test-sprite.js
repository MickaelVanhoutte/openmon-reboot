import fs from 'fs';
import pokedex from '/Users/10123626/PERSO/openmon-reboot/static/resources/dex/base-pokedex-moves.json' with { type: "json" };

const types = ['', '-back', '-shiny' , '-back-shiny'];

// loop pokedex entries
let missing = 0;
 pokedex.map((pokemon) => {
     const name = pokemon.name.english
         .replace('♀', '-f')
         .replace('♂', '-m')
         .replace('-', '')
         .replace('. ', '')
         .replace('\'', '')
         .replace(' ', '')
         .replace('.', '')
         .replaceAll('é', 'e')
         .replace(':', '')
         .toLowerCase();
     for(const type of types) {
            const spritePath = `/Users/10123626/PERSO/openmon-reboot/static/images/sprites${type}/${name}.png`;
            if (!fs.existsSync(spritePath)) {
                console.log(`Sprite not found for ${pokemon.id} - ${name}`);
                missing++;
            }
     }
});
 console.log(`Missing sprites: ${missing}`);