import { themeToggling } from "./theme-toggle.js";
import { displayTopButton } from "./back-to-top.js";
const pokedexWrapper = document.querySelector("#pokedex-wrapper");
const regionSelect = document.querySelector("#dropdown-region");
const searchBar = document.querySelector("#search-bar");

let currentPokemonList = [];

async function fetchPokemon(limit, offset) {
  // fetching data from server
  const url = `/api?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url);
    if(!response.ok) {
      throw new Error(`HTTP Error! Status:${response.status}`);
    }

    currentPokemonList = await response.json();

    renderHTML(currentPokemonList);

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
          <a href="/Public/HTML/entry.html?id=${pokemon.id}">
            <img class="pokemon_img" src="${pokemon.sprites.front_default}">
          </a>
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

  // comparing the value of the items in the regions obj and the value of region1, to get the name of the region stored in localStorage
  const region1 = JSON.parse(localStorage.getItem("region"));
  const regionName = Object.keys(regions).find(key => JSON.stringify(regions[key]) === JSON.stringify(region1)) || "Kanto";
  regionSelect.value = regionName;
  regionSelect.addEventListener("change", async (e) => {
    const region = regions[e.target.value];
    localStorage.setItem("region", JSON.stringify(region));
    await fetchPokemon(region[1], region[0]);
  });
}

function typeHTMLHandler(pokemon) {
  if(pokemon.types.length < 2) {
    return `<img class="type_img" alt="${pokemon.types[0].type.name}" src="../type-icons/${pokemon.types[0].type.name}.avif">`
  } else {
    return `
    <img class="type_img" alt="${pokemon.types[0].type.name}" src="../type-icons/${pokemon.types[0].type.name}.avif">
    <img class="type_img" alt="${pokemon.types[1].type.name}" src="../type-icons/${pokemon.types[1].type.name}.avif">
    `
  }
}

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  const filteredPokemon = currentPokemonList.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(query);
  });
  renderHTML(filteredPokemon);
});

// Last selected region, will be the one the user sees upon coming back to this page via refresh or links.
// The region value stored in the localStorage is used to make this work.
const region = JSON.parse(localStorage.getItem("region"));
const offset = region?.[0] || 0;
const limit = region?.[1] || 151;

themeToggling();
displayTopButton();
regionHandler();
await fetchPokemon(limit, offset);
