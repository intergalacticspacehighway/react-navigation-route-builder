// server.js
const path = require("path");
const fs = require("fs");
const templateRenderers = require("../../templates");
const { v4: uuidv4 } = require("uuid");
const archiver = require("archiver");
const tempPath = path.resolve(__dirname, "tmp");

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

export default async function handler(req, res) {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    const sessionId = uuidv4();
    createDirectories(sessionId);

    generateTemplates({ data: req.body, id: sessionId });
    const folderPath = path.resolve(tempPath, sessionId);

    const outputPath = path.resolve(folderPath, "boilerplate.zip");
    await zipDirectory(folderPath, outputPath);
    const readStream = fs.createReadStream(outputPath);
    readStream.pipe(res);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Something went wrong" }));
  }
}

function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive.directory(source, false).on("error", reject).pipe(stream);

    stream.on("close", resolve);
    archive.finalize();
  });
}
