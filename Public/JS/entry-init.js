import * as TypeData from "../../Data/allTypes.json" with {type: "json"};
const pokemonWrapper = document.querySelector(".pokemon-wrapper_div");
const paginationWrapper = document.querySelector(".pagination-wrapper_div");
const rightWrapper = document.querySelector(".right-wrapper_div");
const theme = localStorage.getItem("theme");
document.body.style.colorScheme = theme;

async function fetchPokemon() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log(id)
  const response = await fetch(`http://localhost:3000/api?id=${id}`)
  if(!response.ok) {
    throw new Error(`HTTP Error! Status:${response.status}`);
  }
  const data = await response.json();

  renderHTML(data[0], data[1])
}

function renderHTML(pokemon, species) {
  console.log(pokemon)
  console.log(species)
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
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <div class="evolution-img_div">
            <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png">
          </div>
          <p>Froakie</p>
        </div>
        <p class="evolve-level">Level 16</p>
      </div>
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <div class="evolution-img_div">
            <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/657.png">
          </div>
          <p>Frogadier</p>
        </div>
        <p class="evolve-level">Level 36</p>
      </div>
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <div class="evolution-img_div">
            <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png">
          </div>
          <p>Greninja</p>
        </div>
      </div>
    </div>
  </div>
  `;

  paginationWrapper.innerHTML = 
  `
  <a class="paging_a" href="http://localhost:3000/Public/HTML/entry.html?id=${((pokemon.id - 1) || 1)}">
    ← Previous
  </a>
  <a class="paging_a" href="http://localhost:3000/Public/HTML/entry.html?id=${((pokemon.id + 1) || 1025)}">
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
        <li>
          <img alt="" src="../type-icons/electric.avif">
        </li>
        <li>
          <img alt="" src="../type-icons/grass.avif">
        </li>
      </ul>
    </div>

    <div class="resist-wrapper_div">
      <h2 class="resist-header_h2">Resistances</h2>
      <ul class="resist-list_ul">
        <li>
          <img alt="" src="../type-icons/fire.avif">
        </li>
        <li>
          <img alt="" src="../type-icons/water.avif">
        </li>
        <li>
          <img alt="" src="../type-icons/ice.avif">
        </li>
        <li>
          <img alt="" src="../type-icons/steel.avif">
        </li>
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

fetchPokemon();