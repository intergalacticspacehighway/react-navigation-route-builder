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
import { useRef, useState } from "react";

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
  const [selected, setSelected] = useState("screen");
  const nameRef = useRef();
  const routeRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      ...nodes.find((item) => item.type === selected),
      name: nameRef.current.value,
    };

    if (routeRef.current && routeRef.current.value) {
      data.route = routeRef.current.value;
    }

    handleAddNode(data);
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
          <Select
            required
            onChange={(e) => setSelected(e.target.value)}
            selected={selected}
          >
            {nodes.map((node) => {
              return (
                <option key={node.type} value={node.type}>
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

        {selected === "screen" && (
          <FormLabel w="100%">
            Enter route
            <Input
              ref={routeRef}
              required
              type="text"
              placeholder="Enter route for the screen"
            ></Input>
          </FormLabel>
        )}
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
