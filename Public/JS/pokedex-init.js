import { themeToggling } from "./theme-toggle.js";
import { displayTopButton } from "./back-to-top.js";
const pokedexWrapper = document.querySelector("#pokedex-wrapper");
const regionSelect = document.querySelector("#dropdown-region");
const searchBar = document.querySelector("#search-bar");

async function fetchPokemon(limit, offset) {
  // fetching data from server
  const url = `http://localhost:3000/api?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url);
    if(!response.ok) {
      throw new Error(`HTTP Error! Status:${response.status}`);
    }

    const pokemonData = await response.json();

    searchHandler(pokemonData);
    renderHTML(pokemonData);

  } catch (err) {
    console.error("Network or parsing error:", err);
  }
}

function renderHTML(pokemonArr) {
  if(pokemonArr.length === 0) {
    return pokedexWrapper.innerHTML = "<h1 class='no-result_h1'>No result</h1>"
  }

  let html = pokemonArr.map((pokemon) => {

    return `
      <div class="pokemon-wrapper_div">
        <img class="pokemon_img" src="${pokemon.sprites.front_default}">
        <p class="pokemon-name_p">${pokemon.name}</p>
        <div class="type-wrapper_div">
          ${typeHTMLHandler(pokemon)}
        </div>
      </div>
    `;
  });

  pokedexWrapper.innerHTML = "";

  html.forEach((item) => {
    pokedexWrapper.insertAdjacentHTML("beforeend", item)
  });
}

function regionHandler() {
  const regions = {
    Kanto:   [0, 151],    // #001 to #151 (151 Pokémon)
    Johto:   [151, 100],  // #152 to #251 (100 Pokémon)
    Hoenn:   [251, 135],  // #252 to #386 (135 Pokémon)
    Sinnoh:  [386, 107],  // #387 to #493 (107 Pokémon)
    Unova:   [493, 156],  // #494 to #649 (156 Pokémon)
    Kalos:   [649, 72],   // #650 to #721 (72 Pokémon)
    Alola:   [721, 88],   // #722 to #809 (88 Pokémon)
    Galar:   [809, 96],   // #810 to #898 (89 Pokémon up to Calyrex)
    // Hisui:   [898, 7],    // #899 to #905 (7 completely new species introduced)
    Paldea:  [905, 120]   // #906 to #1025 (120 Pokémon including DLC expansions)
  };

  regionSelect.addEventListener("change", (e) => {
    const region = regions[e.target.value];
    fetchPokemon(region[1], region[0]);
  });
}

function typeHTMLHandler(pokemon) {
  if(pokemon.types.length < 2) {
    return `<img class="type_img" alt="${pokemon.types[0].type.name}" src="../type-icons/${pokemon.types[0].type.name}.avif">`
  } else {
    return `
    <img class="type_img" alt="${pokemon.types[0].type.name}" src="../type-icons/${pokemon.types[0].type.name}.avif">
    <img class="type_img" alt="${pokemon.types[0].type.name}" src="../type-icons/${pokemon.types[1].type.name}.avif">
    `
  }
}

function searchHandler(pokemon) {
  const unfilteredPokemon = pokemon;
  searchBar.addEventListener("keyup", () => {
    const filteredPokemon = unfilteredPokemon.filter((pokemon) => {
      const name = pokemon.name.toLowerCase();
       return name.includes(searchBar.value.toLowerCase());
    }) || unfilteredPokemon;
    renderHTML(filteredPokemon);
  });
}

themeToggling();
displayTopButton();
regionHandler();
fetchPokemon(151, 0);
