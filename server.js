import * as http from "node:http"; 
import * as fsPromises from "fs/promises"
import * as path from "path";

function cache(capacity) {
  const store = new Map();
  
  const get = (key) => {
    // if conditions don't need brackets if they're one line.
    if(!store.has(key)) return null;
    const value = store.get(key);
    store.delete(key);
    store.set(key, value);

    return value;
  }

  const set = (key, value) => {
    if(store.has(key)) {
      store.delete(key);
    } else if(store.size >= capacity) {
      // gets the the key of the first item due to iterating via next().
      const oldest = store.keys().next().value;
      store.delete(oldest);
    }

    store.set(key, value);
    return;
  }

  const clear = () => {
    store.clear();
  }

  return {get, set, clear}
}

const {get, set, clear} = cache(10);

async function fetchPokeAPI(req, res) {
  try {
    // creating a complete URL using my scheme and the rest of the url
    const myURL = new URL(req.url, "http://localhost:3000");
    const limit = myURL.searchParams.get("limit");
    const offset = myURL.searchParams.get("offset");

    const cachedData = get(`${limit}:${offset}`);

    if(!cachedData) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

      if(!response.ok) {
        throw new Error(`HTTP Error, Status: ${response.status}`);
      }

      const data = await response.json();
      const { results } = data;
      
      const fetchPokemon = results.map(result => fetch(result.url));
      const pokemonResponses = await Promise.all(fetchPokemon);

      if(!pokemonResponses.every(response => response.ok)) {
        throw new Error(`HTTP Error, Status: ${pokemonResponses[0].status}`);
      }

      const pokemonData = await Promise.all(pokemonResponses.map(response => response.json()));

      // Stripping the pokemonData array of the unused properties
      const strippedData = pokemonData.map((data) => {
        return {
          id: data.id,
          name: data.name,
          types: data.types,
          sprites: data.sprites
      }});
      set(`${limit}:${offset}`, strippedData);
      return res.end(JSON.stringify(strippedData));
    }

    return res.end(JSON.stringify(cachedData));
    
  } catch (err) {
    console.error("Error occured:", err)
  }
}

async function fetchEntry(req, res) {
  try {

    // creating a url and retrieving the id param.
    const myURL = new URL(req.url, "http://localhost:3000");
    const pokeID = myURL.searchParams.get("id");
    // Created an array of api urls, and used promise.all to make fetching more efficient.
    const apiURLs = [`https://pokeapi.co/api/v2/pokemon/${pokeID}/`, `https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`];
    const promises = apiURLs.map( url => fetch(url));
    const responses = await Promise.all(promises);
    if(!responses.every(response => response.ok)) {
      throw new Error(`HTTP Error, status:${responses[0].status}`);
    }
    const pokemon = await Promise.all(
      responses.map(response => response.json())
    );
    
    // Fetching evolution chain data using the results of the species fetch
    const response = await fetch(pokemon[1].evolution_chain.url);
    if(!response.ok) {
      throw new Error(`HTTP Error, status:${response.status}`);
    }
    // Using the result of fetching the evo-chain url, to get the url of each evo in the chain
    const evoChain = await response.json();
    const base = evoChain.chain.species.url;
    const evo_1 = evoChain.chain.evolves_to[0]?.species.url;
    const evo_2 = evoChain.chain.evolves_to[0]?.evolves_to[0]?.species.url;

    // fetching the data of each evo in the evo chain
    const evoUrls = [base, evo_1, evo_2];
    // filtering null urls before using map.
    const evoPromises = evoUrls.filter(url => url !== undefined).map(url => fetch(url));
    const evoRespones = await Promise.all(evoPromises);
    if(!evoRespones.every(response => response.ok)) {
      throw new Error(`HTTP Error, status:${responses[0].status}`);
    }

    const evoData = await Promise.all(
      evoRespones.map(response => response.json())
    );
    
    // 0: pokemon api
    // 1: species api
    // 2: evoluion-chain api
    pokemon.push(evoData);
    // filtering the pokemon array of any useless data, before sending it to the client side
    const filteredPokemon = pokemon.map((arrays) => {
      return [
        {
          id: pokemon[0].id,
          name: pokemon[0].name,
          height: pokemon[0].height,
          weight: pokemon[0].weight,
          types: pokemon[0].types,
          abilities: pokemon[0].abilities,
          stats: pokemon[0].stats,
        },

        {
          gender_rate: pokemon[1].gender_rate,
          genera: pokemon[1].genera,
          flavor_text_entries: pokemon[1].flavor_text_entries
        },
        
        [
          {
            id: pokemon[2][0].id,
            name: pokemon[2][0].name
          },
          {
            id: pokemon[2]?.[1]?.id ?? null,
            name: pokemon[2]?.[1]?.name ?? null
          },
          {
            id: pokemon[2]?.[2]?.id ?? null,
            name: pokemon[2]?.[2]?.name ?? null
          }
        ]
      ];
    });
    //  a zero is used because filteredPokemon is an array, and the 0th value stores the data I want.
    return res.end(JSON.stringify(filteredPokemon[0]));
  } catch (err) {
    console.error("Error occured:", err);
  }
}

const server = http.createServer(async (req, res) => {

  const dotMimeTypes = {
    // Base web languages
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    
    // Modern image formats
    ".avif": "image/avif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    
    // Traditional image formats
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    
    // Common application formats
    ".json": "application/json",
    ".xml": "application/xml",
    ".pdf": "application/pdf",
    
    // Audio & Video
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    
    // Web Fonts
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf"
  };

  const extname = path.extname(req.url);
  if(req.url.includes("/Public/")) {
    // Removing the paramters after the ? in the url, so that readfile reads the actual file.
    const paramLessURL = req.url.split("?")[0];
    try {
      const file = await fsPromises.readFile(`./${paramLessURL}`);
      res.writeHead(200, {"content-type": `${dotMimeTypes[extname]}`});
      res.end(file);
    } catch (err) {
      console.error("Error occured:", err);
    }
  } else if (req.url.includes("/api?limit")) {
    try {
      await fetchPokeAPI(req, res);
    } catch (err) {
      console.error("Error occured:", err)
    }
  } else if(req.url.includes("/api?id")) {
    try {
      fetchEntry(req, res);
    } catch (err) {
      console.error("Error occured:", err);
    }
  } else if(req.url.includes("Data")) {
    try {
      const data = await fsPromises.readFile(`./${req.url}`);
      res.writeHead(200, {"content-type": `${dotMimeTypes[extname]}`});
      res.end(data);
    } catch (err) {
      console.error("Error occured:", err);
    }
  } else {
    res.writeHead(404, {"content-type": "text/html"});
    res.end("<h1>Page not found</h1>");
  }


});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Server is running at http://localhost:3000/Public/HTML/index.html");
});