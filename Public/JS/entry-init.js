import typeData from "../../Data/allTypes.json" with {type: "json"};
import { goToDex } from "./back-to-dex.js";
const theme = localStorage.getItem("theme");
document.body.style.colorScheme = theme;
const pokemonWrapper = document.querySelector(".pokemon-wrapper_div");
const paginationWrapper = document.querySelector(".pagination-wrapper_div");
const rightWrapper = document.querySelector(".right-wrapper_div");
const weaknessList = document.querySelector(".weak-list_ul");
const resistanceList = document.querySelector(".resist-list_ul");


async function fetchPokemon() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const response = await fetch(`/api?id=${id}`)
  if(!response.ok) {
    throw new Error(`HTTP Error! Status:${response.status}`);
  }
  const data = await response.json();
  console.log(data);

  renderHTML(data[0], data[1], data[2]);
}

function renderHTML(pokemon, species, evoChain) {
  const typeChart = getMultipliers(pokemon.types);
  pokemonWrapper.innerHTML = 
  `
  <div class="entry-name_div">
    <h1 class="entry-name_h1">${pokemon.name} <sup>#${pokemon.id}</sup></h1>
    <div class="type-wrapper_div">
      ${typeHTMLHandler(pokemon)}
    </div>
  </div>

  <div class="pokemon-img_div">
    <img alt="" class="pokemon_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png">
  </div>

  <div class="evolution-wrapper_div">
    <h2 class="evolution-wrapper_h2">Evolutions</h2>
    <div class="evolution-line_div">
      ${getEvoChain(evoChain, pokemon.id, pokemon.name)}
    </div>
  </div>
  `;

  paginationWrapper.innerHTML = 
  `
  <a class="paging_a" href="/Public/HTML/entry.html?id=${((pokemon.id - 1) || 1)}">
    ← Previous
  </a>
  <a class="paging_a" href="/Public/HTML/entry.html?id=${((pokemon.id + 1) || 1025)}">
    Next →
  </a>
  `;

  rightWrapper.innerHTML = 
  `
  <div class="story-wrapper_div">
    <h2 class="story-header_h2">Pokedex Entry</h2>
    <p class="story-copy_p">
      ${flavorTextHandler(species)}
    </p>
  </div>

  <div class="pokemon-data-wrapper_div">
    <div class="data-wrapper_div">
      <h2 class="data-header_h2">Pokemon Data</h2>
      <div class="table-wrapper_div">
        <table class="pokemon-data_table">
          <tbody>
            <tr>
              <th>Type</th>
              <td>${typeHTMLHandlerTable(pokemon)}</td>
            </tr>
            <tr>
              <th>Species</th>
              <td>${generaHandler(species)}</td>
            </tr>
            <tr>
              <th>Height</th>
              <td>${pokemon.height} m</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>${pokemon.weight} kg</td>
            </tr>
            <tr>
              <th>Abilities</th>
              <td>
                <ol class="abilities_ol">
                ${abilitiesHandler(pokemon)}
                </ol>
              </td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>${genderHandler(species)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="weak-wrapper_div">
      <h2 class="weak-header_h2">Weaknesses</h2>
      <ul class="weak-list_ul">
      ${typeChart[0]}
      </ul>
    </div>

    <div class="resist-wrapper_div">
      <h2 class="resist-header_h2">Resistances</h2>
      <ul class="resist-list_ul">
      ${typeChart[1]}
      </ul>
    </div>

  </div>

  <div class="stats-wrapper_div">
    <h2 class="stats-header_h2">Stats</h2>
    <table class="stats_table">
      <tbody>
        <tr>
          <th>HP</th>
          <td class="stat-value_td">${pokemon.stats[0].base_stat}</td>
          <td class="stat-bar_td">
            <div style="--bar-percentage: ${((pokemon.stats[0].base_stat)/100)};" class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Attack</th>
          <td class="stat-value_td">${pokemon.stats[1].base_stat}</td>
          <td class="stat-bar_td">
            <div style="--bar-percentage: ${((pokemon.stats[1].base_stat)/100)};" class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Defense</th>
          <td class="stat-value_td">${pokemon.stats[2].base_stat}</td>
          <td class="stat-bar_td">
            <div style="--bar-percentage: ${((pokemon.stats[2].base_stat)/100)};" class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Sp. Atk</th>
          <td class="stat-value_td">${pokemon.stats[3].base_stat}</td>
          <td class="stat-bar_td">
            <div style="--bar-percentage: ${((pokemon.stats[3].base_stat)/100)};" class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Sp. Def</th>
          <td class="stat-value_td">${pokemon.stats[4].base_stat}</td>
          <td class="stat-bar_td">
            <div style="--bar-percentage: ${((pokemon.stats[4].base_stat)/100)};" class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Speed</th>
          <td class="stat-value_td">${pokemon.stats[5].base_stat}</td>
          <td class="stat-bar_td">
            <div style="--bar-percentage: ${((pokemon.stats[5].base_stat)/100)};" class="stat-bar_div"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `;
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

function typeHTMLHandlerTable(pokemon) {
  if(pokemon.types.length < 2) {
    return `<span>${pokemon.types[0].type.name}<span>`
  } else {
    return `
    <span>${pokemon.types[0].type.name}<span>,
    <span>${pokemon.types[1].type.name}</span>
    `
  }
}

function abilitiesHandler(pokemon) {
  const htmlArray = [];
  for (const ability of pokemon.abilities) {
    if(ability.is_hidden) {
      htmlArray.push(`<li>${ability.ability.name} <span>(hidden ability)</span></li>`);
    } else {
      htmlArray.push(`<li>${ability.ability.name}</li>`);
    }
  }
  return htmlArray.join("");
}

function genderHandler(species) {
  if(species.gender_rate === -1) {
    return `N/A`;
  } else if(species.gender_rate === 0) {
    return 'Male Only';
  } else if(species.gender_rate === 8) {
    return 'Female Only';
  } else {
    return `M & F`;
  }
}

function flavorTextHandler(species) {
  for(const flavorText of species.flavor_text_entries) {
    if(flavorText.language.name === "en") {
      return flavorText.flavor_text
    }
  }
}

function generaHandler(species) {
  for(const genus of species.genera) {
    if(genus.language.name === "en") {
      return genus.genus;
    }
  }
}

function getMultipliers(types){
  // Getting the name of each type from the result of the PokeApi
  const type1 = types[0].type.name;
  const type2 = types[1]?.type.name;

  const singleType = typeData[type1] // retreiving data from allTypes.json file
  const dualType = typeData[`${type1}_${type2}`]
  const dualType2 = typeData[`${type2}_${type1}`] // creating two dual types because some pokemon are listed fire-dark, while others dark-fire
                                                  // e.g Houndoom and Incineroar
  // Arrays to hold the <li><li> elements of each list
  const weakArray = [];
  const resistArray = [];

  // utilising if conditions to determine if a pokemon is single type, or not, before listing weaknesses and resistances
  // check what the decoding attr does to imgs
  if(!type2){
    for(const weakness of singleType.weaknesses ){
      weakArray.push(
        `<li>
        <img alt="${weakness}" src="../type-icons/${weakness}.avif">
        </li>`
      );
     }
    
     for(const resistance of singleType.resistances ){
      resistArray.push( 
        `<li>
        <img alt="${resistance}" src="../type-icons/${resistance}.avif">
        </li>`
      );
     }
  }else if(dualType){
    for(const weakness of dualType.weaknesses ){
      weakArray.push(
        `<li>
        <img alt="${weakness}" src="../type-icons/${weakness}.avif">
        </li>`
      );
     }
    
     for(const resistance of dualType.resistances ){
      resistArray.push( 
        `<li>
        <img alt="${resistance}" src="../type-icons/${resistance}.avif">
        </li>`
      );
     }
  }else if(dualType2){
    for(const weakness of dualType2.weaknesses ){
      weakArray.push(
        `<li>
        <img alt="${weakness}" src="../type-icons/${weakness}.avif">
        </li>`
      );
     }
    
     for(const resistance of dualType2.resistances ){
      resistArray.push( 
        `<li>
        <img alt="${resistance}" src="../type-icons/${resistance}.avif">
        </li>`
      );
     }
  }
  return [weakArray.join(""), resistArray.join("")];
}

function getEvoChain(evoChain) {
  const base = evoChain[0];
  const evo_1 = evoChain[1]
  const evo_2 = evoChain[2]
  if(evo_1.id && evo_2.id) {
    return `
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <a href="/Public/HTML/entry.html?id=${base.id}">
            <div class="evolution-img_div">
              <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${base.id}.png">
            </div>
          </a>  
          <p>${base.name}</p>
        </div>
        <p class="evolve-level"></p>
      </div>

      <div class="evolution_div">
        <div class="evolution-prev_div">
          <a href="/Public/HTML/entry.html?id=${evo_1.id}">
            <div class="evolution-img_div">
              <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo_1.id}.png">
            </div>
          </a>  
          <p>${evo_1.name}</p>
        </div>
        <p class="evolve-level"></p>
      </div>
      
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <a href="/Public/HTML/entry.html?id=${evo_2.id}">
            <div class="evolution-img_div">
              <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo_2.id}.png">
            </div>
          </a>
          <p>${evo_2.name}</p>
        </div>
      </div>
      `
  } else if (evo_1.id && !evo_2.id) {
    return `
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <a href="/Public/HTML/entry.html?id=${base.id}">
            <div class="evolution-img_div">
              <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${base.id}.png">
            </div>
          </a>  
          <p>${base.name}</p>
        </div>
        <p class="evolve-level"></p>
      </div>

      <div class="evolution_div">
        <div class="evolution-prev_div">
          <a href="/Public/HTML/entry.html?id=${evo_1.id}">
            <div class="evolution-img_div">
              <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo_1.id}.png">
            </div>
          </a>  
          <p>${evo_1.name}</p>
        </div>
      </div>
      `
  } else {
    return `
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <a href="/Public/HTML/entry.html?id=${base.id}">
            <div class="evolution-img_div">
              <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${base.id}.png">
            </div>
          </a>
          <p>${base.name}</p>
        </div>
      </div>
      `
  }
}

goToDex();
fetchPokemon();