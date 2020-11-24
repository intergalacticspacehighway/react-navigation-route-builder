// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const generateTemplates = (tree) => {
  let visitedSet = new Set();
  let queue = [];
  queue.push(tree);
  visitedSet.add(tree.id);
  // Create templates and files for root stack

  while (queue.length !== 0) {
    let node = queue.shift();
    // console.log("nodes ", node);

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

export default (req, res) => {
  const treeData = JSON.parse(req.body);
  generateTemplates(treeData);
  res.statusCode = 200;
  res.json({ name: "John Doe" });
};
