import * as http from "node:http"; 
import * as fs from "node:fs";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    console.log("hi server");
    
      
      fs.readFile("./HTML/index.html", (err, data) => {
        res.writeHead(200, {"Content-type": "text/html"});
        res.end(data);
      })
  } else {

      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});