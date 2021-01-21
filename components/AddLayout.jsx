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

const initialState = {
  name: "",
  route: "",
};

export function AddLayout({ handleAddNode, selectedNode, handleEditNode }) {
  const [selected, setSelected] = useState("screen");
  const [formState, setFormState] = useState(initialState);

  const isEditingScreen = selectedNode.id && selectedNode.type === selected;

  React.useEffect(() => {
    if (isEditingScreen) {
      setFormState({
        name: selectedNode.name,
        route: selectedNode.route,
        id: selectedNode.id,
      });
    } else {
      setFormState(initialState);
    }
  }, [selectedNode, isEditingScreen]);

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      ...nodes.find((item) => item.type === selected),
      ...formState,
    };

    if (isEditingScreen) {
      console.log({ selectedNode, data });
      data = {
        ...selectedNode,
        ...data,
      };
      handleEditNode(data);
    } else {
      handleAddNode(data);
    }
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
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            required
            type="text"
            placeholder="Enter name of the layout/screen"
          ></Input>
        </FormLabel>

        {selected === "screen" && (
          <FormLabel w="100%">
            Enter route
            <Input
              value={formState.route}
              onChange={(e) =>
                setFormState({ ...formState, route: e.target.value })
              }
              required
              type="text"
              placeholder="Enter route for the screen"
            ></Input>
          </FormLabel>
        )}
        <Box>
          <Button type="submit">Add Layout</Button>
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
