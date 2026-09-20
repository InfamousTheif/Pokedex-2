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
    console.log(pokeID);
    // Created an array of api urls, and used promise.all to make fetching more efficient.
    const apiURLs = [`https://pokeapi.co/api/v2/pokemon/${pokeID}/`, `https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`];
    const promises = apiURLs.map( url => fetch(url));
    const responses = await Promise.all(promises);
    if(!responses.every(response => response.ok)) {
      throw new Error(`HTTP Error, Status:${responses[0].status}`);
    }
    const pokemon = await Promise.all(
      responses.map(response => response.json())
    );
    // 0: pokemon api
    // 1: species api
    return res.end(JSON.stringify(pokemon));
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
      console.log("Entry api")
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

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});