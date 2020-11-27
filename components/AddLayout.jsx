import {
  Box,
  Button,
  Select,
  VStack,
  Input,
  FormLabel,
  AlertDescription,
  Alert,
  AlertTitle,
  Link,
} from "@chakra-ui/react";
import { useRef } from "react";

const nodes = [
  {
    label: "Screen",
    type: "screen",
  },
  {
    label: "Stack",
    type: "stack",
  },
  {
    label: "Drawer",
    type: "drawer",
  },
  {
    label: "Material Top tab",
    type: "materialTopTab",
  },
  {
    label: "Material Bottom tab",
    type: "materialBottomTab",
  },
  {
    label: "Bottom tab",
    type: "bottomTab",
  },
];

export function AddLayout({ handleAddNode, selectedNode }) {
  const ref = useRef();
  const nameRef = useRef();
  const onSubmit = (e) => {
    e.preventDefault();
    handleAddNode({
      ...nodes[ref.current.value],
      name: nameRef.current.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack
        border="1px solid"
        borderColor="teal.200"
        p={10}
        spacing={5}
        alignItems="center"
      >
        <FormLabel w="100%">
          Select layout/screen
          <Select ref={ref} required>
            {nodes.map((node, index) => {
              return (
                <option key={node.type} value={index}>
                  {node.label}
                </option>
              );
            })}
          </Select>
        </FormLabel>

        <FormLabel w="100%">
          Enter name
          <Input
            ref={nameRef}
            required
            type="text"
            placeholder="Enter name of the layout/screen"
          ></Input>
        </FormLabel>
        <Box>
          <Button type="submit" disabled={selectedNode.type === "screen"}>
            Add Layout
          </Button>
        </Box>

        <Alert status="success" variant="subtle" w="100%" bg="gray.200">
          <AlertTitle mr={2}>Important:</AlertTitle>
          <AlertDescription>
            <Link
              href="https://reactnavigation.org/docs/nesting-navigators#best-practices-when-nesting"
              target="__blank"
            >
              Read nested navigators best practices
            </Link>
          </AlertDescription>
        </Alert>
      </VStack>
    </form>
  );
}
