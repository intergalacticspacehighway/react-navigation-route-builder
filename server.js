// server.js
const { parse } = require("url");
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT, 10) || 3000;
const bodyParser = require("body-parser");

const generateTemplates = (tree) => {
  let visitedSet = new Set();
  let queue = [];
  queue.push(tree);
  visitedSet.add(tree.id);
  // Create templates and files for root stack

  while (queue.length !== 0) {
    let node = queue.shift();
    for (let i = 0; i < node.children.length; i++) {
      const childNode = node.children[i];
      if (!visitedSet.has(childNode.id)) {
        queue.push(childNode);
        visitedSet.add(childNode.id);
        // Create templates and files childNode
      }
    }
  }
};

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.post("/api/generate", (req, res) => {
    console.log(req.body);
    return res.send("ok");
  });

  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);

    return handle(req, res, parsedUrl);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
