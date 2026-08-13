import { themeToggling } from "./theme-toggle.js";
import { displayTopButton } from "./back-to-top.js";
const pokedexWrapper = document.querySelector("#pokedex-wrapper");

async function fetchPokemon(limit, offset) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}/`;
  try {
    const response = await fetch(url);
    if(!response.ok) {
      throw new Error(`HTTP Error! Status:${response.status}`);
    }

    const data = await response.json();
    const results = data.results;
    console.log(results);

    const fetchPokemon = results.map((result) => {
      return fetch(result.url);
    });

    const pokemonResponses = await Promise.all(fetchPokemon);

    if(!pokemonResponses.every(response => response.ok)) {
      throw new Error(`HTTP error! Status:${pokemonResponses.status}`);
    }

    const pokemonData = await Promise.all(pokemonResponses.map(response => response.json()));
    console.log(pokemonData);

    renderHTML(pokemonData);

  } catch (err) {
    console.error("Network or parsing error", err);
  }
}

function renderHTML(pokemonArr) {

  const html = pokemonArr.map((pokemon) => {
    console.log(pokemon.types[0].type.name)
    

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

  html.forEach((item) => {
    pokedexWrapper.insertAdjacentHTML("beforeend", item)
  });

}

function typeHTMLHandler(pokemon) {
  if(pokemon.types.length < 2) {
    return `<img class="type_img" src="../Assets/type-icons/${pokemon.types[0].type.name}.avif">`
  } else {
    return `
    <img class="type_img" src="../Assets/type-icons/${pokemon.types[0].type.name}.avif">
    <img class="type_img" src="../Assets/type-icons/${pokemon.types[1].type.name}.avif">
    `
  }
}

themeToggling();
displayTopButton();
fetchPokemon(151, 0);
