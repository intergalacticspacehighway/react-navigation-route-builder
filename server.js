// server.js
const { parse } = require("url");
const path = require("path");
const express = require("express");
const next = require("next");
const { fs } = require("memfs");
const templateRenderers = require("./templates");
const { v4: uuidv4 } = require("uuid");
const zip = require("express-easy-zip");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT, 10) || 3000;
const bodyParser = require("body-parser");
const { cursorTo } = require("readline");
const tempPath = "/temp";

const generateFileForNode = ({ id, node }) => {
  // console.log({ node });
  const templateString = getTemplateString({
    type: node.type,
    children: node.children,
    name: node.name,
  });
  createFile({
    id,
    templateString,
    type: node.type,
    name: node.name,
  });
};

const generateTemplates = ({ data, id }) => {
  let visitedSet = new Set();
  let queue = [];
  queue.push(data);
  visitedSet.add(data.id);

  while (queue.length !== 0) {
    let node = queue.shift();

    generateFileForNode({ id, node });

    for (let i = 0; i < node.children.length; i++) {
      const childNode = node.children[i];
      if (!visitedSet.has(childNode.id)) {
        queue.push(childNode);
        visitedSet.add(childNode.id);
      }
    }
  }
};

app.prepare().then(() => {
  const server = express();
  server.use(zip());

  server.use(bodyParser.json());

  server.post("/api/generate", async (req, res) => {
    const sessionId = uuidv4();
    createDirectories(sessionId);

    generateTemplates({ data: req.body, id: sessionId });
    const folderPath = path.resolve(tempPath, sessionId);
    // const directories = fs.readdirSync(tempPath);
    const filePath = getAFileFromFolder(folderPath);
    console.log({ filePath });
    const fileContent = fs.readFileSync(`/temp/${sessionId}/screens/A.tsx`, {
      encoding: "utf-8",
    });
    res
      .zip({
        files: [
          {
            content: fileContent,
            name: "file-name.tsx",
            mode: 0755,
            comment: "comment-for-the-file",
            date: new Date(),
            type: "file",
          },
        ],
        filename: "boilerplate.zip",
      })
      .then(function (obj) {
        const zipFileSizeInBytes = obj.size;
        const ignoredFileArray = obj.ignored;
        console.log("zip sent ", { zipFileSizeInBytes, ignoredFileArray });
        deleteDirectories(sessionId);
      })
      .catch(function (err) {
        deleteDirectories(sessionId);
        console.log(err);
      });
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

const createDirectories = (id) => {
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
  }

  const folderPath = path.resolve(tempPath, id);
  fs.mkdirSync(folderPath);

  let directories = ["navigators", "screens"];
  directories.forEach((directory) => {
    // console.log(__dirname, "temp", id, directory);
    const directoryPath = path.resolve(folderPath, directory);
    fs.mkdirSync(directoryPath);
  });
};

const deleteDirectories = (id) => {
  const folderPath = path.resolve(tempPath, id);
  deleteFolderRecursive(folderPath);
};

// Stolen from https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
const deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const getAFileFromFolder = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + "/" + file;
      console.log("file ", file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        const file = getAFileFromFolder(curPath);
        return file;
      } else {
        // delete file
        return curPath;
      }
    });
  }
};

const getTemplateString = ({ children, type, name }) => {
  const templateRenderer = templateRenderers[type];
  const string = templateRenderer({
    children: children,
    name,
  });
  return string;
};

const createFile = ({ id, templateString, type, name }) => {
  let folderPath = path.resolve(tempPath, id, "navigators");
  if (type === "screen") {
    folderPath = path.resolve(tempPath, id, "screens");
    const exportsString = `export * from "./${name}"\n`;
    const indexFilePath = path.resolve(folderPath, `index.tsx`);
    fs.appendFileSync(indexFilePath, exportsString);
  }

  const filePath = path.resolve(folderPath, `${name}.tsx`);
  // console.log({ templateString });
  fs.writeFileSync(filePath, templateString);
};
