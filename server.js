import * as http from "node:http"; 
import * as fs from "node:fs";
import * as fsPromises from "fs/promises"
import * as path from "path";
import { dot } from "node:test/reporters";

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

  const extname = path.extname(req.url);

  
  // switch(req.url) {
  //   case "/":
  //     fs.readFile("./HTML/index.html", (err, data) => {
  //       res.writeHead(200, {"Content-type": `${dotMimeTypes[extname]}`});
  //       res.end(data);
  //     });
  //   break;
  //   default:
  //     res.writeHead(404, {"Content-type": "text/html"});
  //     res.end("<h1>404 error. Page not found<h1>");   
  // }


  // if (req.url === "/") {
  //   console.log("hi server");
      
  //     fs.readFile("./HTML/index.html", (err, data) => {
  //       res.writeHead(200, {"Content-type": "text/html"});
  //       res.end(data);
  //     })
  // } else if (req.url === "/CSS/home.css") {
  //   console.log("css file");

  //   fs.readFile("./CSS/home.css", (err, data) => {
  //     res.writeHead(200, {"Content-type": "text/css" });
  //     res.end(data);
  //   })
  // } else {
  //     res.writeHead(404, { "Content-Type": "text/html" });
  //     res.end("<h1>Page Not Found</h1>");
  // }
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});