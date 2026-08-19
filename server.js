import * as http from "node:http"; 
import * as fsPromises from "fs/promises"
import * as path from "path";

const server = http.createServer((req, res) => {

  const mimeTypes = {
      // Your requested base types
      html: "text/html",
      css: "text/css",
      js: "text/javascript", // Industry standard (replaces application/javascript)
      
      // Modern image formats
      avif: "image/avif",
      webp: "image/webp",
      svg: "image/svg+xml",   // Official standard for SVGs
      
      // Traditional image formats
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      ico: "image/x-icon",
      
      // Common application formats
      json: "application/json",
      xml: "application/xml",
      pdf: "application/pdf",
      
      // Audio & Video
      mp4: "video/mp4",
      webm: "video/webm",
      mp3: "audio/mpeg",
      
      // Web Fonts
      woff2: "font/woff2",
      woff: "font/woff",
      ttf: "font/ttf"
  };

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



});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});