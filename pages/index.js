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

  const handleSubmit = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify(treeData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log({ res });
  };

  return (
    <div>
      <Head>
        <title>RN builder</title>
      </Head>
      <Flex flexDirection="row" justify="space-between">
        <Layout
          data={treeData}
          selectedParent={selectedParent}
          onSelectParent={(parent) => setSelectedParent(parent)}
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
