import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { AddLayout } from "../components/AddLayout";
import { Layout } from "../components/Layout";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Flex, VStack, Link } from "@chakra-ui/react";

const persistKey = "persisterState";

const rootTree = {
  type: "stack",
  id: "root",
  name: "RootStack",
  children: [],
};

const getPersisterStateOrDefaultState = () => {
  let state = rootTree;
  try {
    if (localStorage.getItem(persistKey)) {
      state = JSON.parse(localStorage.getItem(persistKey));
    }
  } catch (e) {
    state = rootTree;
  }

  return state;
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
  const [treeData, setTreeData] = useState(getPersisterStateOrDefaultState);
  const [selectedNodeId, setSelectedNodeId] = useState(rootTree.id);
  const selectedNode = useMemo(() => {
    const node = findTreeNode(treeData, selectedNodeId);
    return node;
  }, [selectedNodeId, treeData]);

  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(treeData));
  }, [treeData]);

  const onAddNode = (node) => {
    const parent = findTreeNode(treeData, selectedNodeId);
    // mutation, but okay since we're changing the reference of treeState anyways
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

    // mutation, but okay since we're changing the reference of treeState anyways
    parent.children = parent.children.filter((child) => child.id !== nodeId);

    setSelectedNodeId(parent.id);
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
        <title>RN route builder</title>
      </Head>
      <Flex flexDirection="row" justify="space-between">
        <Layout
          data={treeData}
          selectedNodeId={selectedNodeId}
          onRemove={onRemove}
          onSelectNode={setSelectedNodeId}
        />
        <Box ml="auto">
          <VStack spacing={4}>
            <AddLayout handleAddNode={onAddNode} selectedNode={selectedNode} />
            <Button onClick={handleSubmit}>Generate</Button>
            <Link
              href="https://github.com/intergalacticspacehighway/react-navigation-route-builder"
              isExternal
            >
              GitHub
            </Link>
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
