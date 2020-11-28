const commonImports = `import React from "react"`;

const dynamicImports = (children) => {
  const screenChildren = children.filter((child) => child.type === "screen");
  const navigatorChildren = children.filter((child) => child.type !== "screen");

  return `
import { ${screenChildren
    .map((child) => child.name)
    .join(", ")} } from "../screens";  
${navigatorChildren
  .map((child) => {
    return `import {${child.name}} from "./${child.name}"`;
  })
  .join("\n")}
`;
};

const stack = ({ children, name }) => {
  return `
${commonImports};
    import { createStackNavigator } from '@react-navigation/stack';
${dynamicImports(children)}
    
const Stack = createStackNavigator();
    
export function ${name}() {
    return (
        <Stack.Navigator>
        ${children
          .map((child) => {
            return `<Stack.Screen name="${child.name}" component={${child.name}} />`;
          })
          .join("\n")}
          
        </Stack.Navigator>
    );
}    
`;
};

const drawer = ({ children, name }) => {
  return `
${commonImports};
import { createDrawerNavigator } from '@react-navigation/drawer';
${dynamicImports(children)}

const Drawer = createDrawerNavigator();
    
export function ${name}() {
    return (
        <Drawer.Navigator>
        ${children
          .map((child) => {
            return `<Drawer.Screen name="${child.name}" component={${child.name}} />`;
          })
          .join("\n")}
          
        </Drawer.Navigator>
      );
}    
`;
};

const materialTopTab = ({ children, name }) => {
  return `
${commonImports};
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

${dynamicImports(children)}
 
const Tab = createMaterialTopTabNavigator();
    
export function ${name}() {
    return (
        <Tab.Navigator>
        ${children
          .map((child) => {
            return `<Tab.Screen name="${child.name}" component={${child.name}} />`;
          })
          .join("\n")}
          
        </Tab.Navigator>
      );
}    
`;
};

const materialBottomTab = ({ children, name }) => {
  return `
${commonImports};
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

${dynamicImports(children)}

const Tab = createMaterialBottomTabNavigator();

export function ${name}() {
      return (
        <Tab.Navigator>
        ${children
          .map((child) => {
            return `<Tab.Screen name="${child.name}" component={${child.name}} />`;
          })
          .join("\n")}
          
        </Tab.Navigator>
    );
}    
`;
};

const bottomTab = ({ children, name }) => {
  return `
${commonImports};
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

${dynamicImports(children)}

const Tab = createBottomTabNavigator();
    
export function ${name}() {
    return (
        <Tab.Navigator>
        ${children
          .map((child) => {
            return `<Tab.Screen name="${child.name}" component={${child.name}} />`;
          })
          .join("\n")}
          
        </Tab.Navigator>
    );
}    
`;
};

const screen = ({ name }) => {
  return `
${commonImports};
  
export function ${name}() {
      return (
        <></>
  );
}    
`;
};

module.exports = {
  stack,
  screen,
  drawer,
  materialTopTab,
  materialBottomTab,
  bottomTab,
};
