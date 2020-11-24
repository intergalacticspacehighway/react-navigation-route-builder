import { Box, Button, List, ListItem } from "@chakra-ui/react";

export function Layout({ data, onSelectParent, selectedParent }) {
  const renderTree = (tree) => {
    return (
      <List pl={5}>
        {tree.children.map((child, index) => {
          return (
            <ListItem key={child.id} pl={1} pt={1}>
              <Button
                variant="outline"
                onClick={() => onSelectParent(child.id)}
                bg={selectedParent === child.id ? "green.200" : "none"}
              >
                {child.label}
              </Button>
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
            bg={selectedParent === data.id ? "green.200" : "none"}
          >
            Root stack
          </Button>
        </ListItem>
      </List>
      {renderTree(data)}
    </Box>
  );
}
