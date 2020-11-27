import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  CloseButton,
} from "@chakra-ui/react";

export function Layout({ data, onSelectNode, selectedNodeId, onRemove }) {
  const renderTree = (tree) => {
    return (
      <List pl={5}>
        {tree.children.map((child, index) => {
          return (
            <ListItem key={child.id} pl={1} pt={1}>
              <HStack spacing={2}>
                <Button
                  variant="outline"
                  onClick={() => onSelectNode(child.id)}
                  bg={selectedNodeId === child.id ? "green.200" : "none"}
                >
                  {child.name} ({child.label})
                </Button>

                <CloseButton onClick={() => onRemove(child.id)}></CloseButton>
              </HStack>
              {child.children.length > 0 ? renderTree(child) : null}
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box
      alignItems="flex-start"
      display="flex"
      justifyContent="flex-start"
      flexDirection="column"
    >
      <List pl={5}>
        <ListItem pl={1} pt={1}>
          <Button
            variant="outline"
            onClick={() => onSelectParent(data.id)}
            bg={selectedNodeId === data.id ? "green.200" : "none"}
          >
            Root stack
          </Button>
        </ListItem>
      </List>
      {renderTree(data)}
    </Box>
  );
}
