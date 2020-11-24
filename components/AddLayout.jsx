import { Box, Button, Flex, Select, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";

const nodes = [
  {
    label: "Stack",
    type: "stack",
  },
  {
    label: "Drawer",
    type: "drawer",
  },
  {
    label: "Bottom tab",
    type: "tab_bottom",
  },
  {
    label: "Top tab",
    type: "tab_top",
  },
  {
    label: "Screen",
    type: "screen",
  },
];

export function AddLayout({ handleAddNode, selectedParent }) {
  const ref = useRef();
  return (
    <Box>
      <Flex justify="center" alignItems="center" mt={10}>
        <VStack
          border="1px solid"
          borderColor="teal.200"
          p={10}
          alignItems="center"
        >
          <Select ref={ref}>
            {nodes.map((node, index) => {
              return (
                <option key={node.type} value={index}>
                  {node.label}
                </option>
              );
            })}
          </Select>
          <Button
            disabled={selectedParent.type === "screen"}
            onClick={() => handleAddNode(nodes[ref.current.value])}
          >
            Add Layout
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
}
