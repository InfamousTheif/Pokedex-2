const pokemonWrapper = document.querySelector(".pokemon-wrapper_div");
const paginationWrapper = document.querySelector(".pagination-wrapper_div");
const rightWrapper = document.querySelector(".right-wrapper_div");
const theme = localStorage.getItem("theme");
document.body.style.colorScheme = theme;

async function fetchPokemon() {
  const response = fetch(`http://localhost:3000/api?no=${1}`)
  if(!response.ok) {
    throw new Error(`HTTP Error! Status:${response.status}`);
  }
  const data = (await response).json();

  renderHTML(data)
}

function renderHTML(pokemon) {
  console.log(pokemon)
  pokemonWrapper.innerHTML = 
  `
  <div class="entry-name_div">
    <h1 class="entry-name_h1">Froakie <sup>#656</sup></h1>
    <div class="type-wrapper_div">
      <img alt="" class="type_img" src="../type-icons/water.avif">
    </div>
  </div>

  <div class="pokemon-img_div">
    <img alt="" class="pokemon_img" src="../Images/656.png">
  </div>

  <div class="evolution-wrapper_div">
    <h2 class="evolution-wrapper_h2">Evolutions</h2>
    <div class="evolution-line_div">
      <div class="evolution_div">
        <div class="evolution-prev_div">
          <div class="evolution-img_div">
            <img alt="" class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png">
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
  <a class="paging_a" href="">
    ← Previous
  </a>
  <a class="paging_a" href="">
    Next →
  </a>
  `;

  rightWrapper.innerHTML = 
  `
  <div class="story-wrapper_div">
    <h2 class="story-header_h2">Pokedex Entry</h2>
    <p class="story-copy_p">
      It protects its skin by covering its body in delicate bubbles. Beneath its happy-go-lucky air, it keeps a watchful eye on its surroundings.
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
              <td>Water</td>
            </tr>
            <tr>
              <th>Species</th>
              <td>Bubble Frog Pokemon</td>
            </tr>
            <tr>
              <th>Height</th>
              <td>0.3m</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>7.0kg</td>
            </tr>
            <tr>
              <th>Abilities</th>
              <td>
                <span>1.Torrent</span>
                <span>2.Protean (hidden)</span>
              </td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>M & F</td>
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
          <td class="stat-value_td">41</td>
          <td class="stat-bar_td">
            <div style="--bar-width: 40%; --bar-color: #F04444;" class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Attack</th>
          <td class="stat-value_td">56</td>
          <td class="stat-bar_td">
            <div class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Defense</th>
          <td class="stat-value_td">40</td>
          <td class="stat-bar_td">
            <div class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Sp. Atk</th>
          <td class="stat-value_td">62</td>
          <td class="stat-bar_td">
            <div class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Sp. Def</th>
          <td class="stat-value_td">44</td>
          <td class="stat-bar_td">
            <div class="stat-bar_div"></div>
          </td>
        </tr>
        <tr>
          <th>Speed</th>
          <td class="stat-value_td">71</td>
          <td class="stat-bar_td">
            <div class="stat-bar_div"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `;
}

fetchPokemon();