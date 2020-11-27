import Head from "next/head";
import { useMemo, useState } from "react";
import { AddLayout } from "../components/AddLayout";
import { Layout } from "../components/Layout";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";

const dummyTree = {
  type: "stack",
  id: "root",
  name: "RootStack",
  children: [],
};

const findTreeNode = (tree, id) => {
  if (tree.id === id) {
    return tree;
  }

  for (let i = 0; i < tree.children.length; i++) {
    const childNode = findTreeNode(tree.children[i], id);
    if (childNode) {
      return childNode;
    }
  }
};

export default function Home() {
  const [treeData, setTreeData] = useState(dummyTree);
  const [selectedParent, setSelectedParent] = useState(dummyTree.id);
  const parent = useMemo(() => {
    const node = findTreeNode(treeData, selectedParent);
    return node;
  }, [selectedParent, treeData]);

  const onAddNode = (node) => {
    const parent = findTreeNode(treeData, selectedParent);
    parent.children = parent.children.concat({
      ...node,
      children: [],
      id: uuidv4(),
    });

    setTreeData({
      ...treeData,
    });
  };

  const onRemove = (nodeId) => {
    let parent;

    const findParentOfNode = (tree, id) => {
      if (tree.id === id) {
        return tree;
      }

      for (let i = 0; i < tree.children.length; i++) {
        const childNode = findParentOfNode(tree.children[i], id);
        if (childNode && !parent) {
          parent = tree;
        }
      }
    };

    findParentOfNode(treeData, nodeId);

    console.log({ nodeId, parent });

    parent.children = parent.children.filter((child) => child.id !== nodeId);

    setSelectedParent(parent.id);
    setTreeData({
      ...treeData,
    });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(treeData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob())
      .then(downloadFile);

    console.log({ res });
  };

  return (
    <div>
      <Head>
        <title>RN boilerplate generator</title>
      </Head>
      <Flex flexDirection="row" justify="space-between">
        <Layout
          data={treeData}
          selectedParent={selectedParent}
          onRemove={onRemove}
          onSelectParent={setSelectedParent}
        />
        <Box ml="auto">
          <VStack spacing={4}>
            <AddLayout handleAddNode={onAddNode} selectedParent={parent} />
            <Button onClick={handleSubmit}>Generate</Button>
          </VStack>
        </Box>
      </Flex>
    </div>
  );
}

const downloadFile = (blob) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "boilerplate.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
