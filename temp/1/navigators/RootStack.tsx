
    import React from "react";
    import { createStackNavigator } from '@react-navigation/stack';
    
  import { Screen1, Screen2 } from "../screens";  
  import {DashboardStack} from "./DashboardStack"
  
    
    const Stack = createStackNavigator();
    
    export function RootStack() {
      return (
        <Stack.Navigator>
        <Stack.Screen name="Screen1" component={Screen1} />
<Stack.Screen name="Screen2" component={Screen2} />
<Stack.Screen name="DashboardStack" component={DashboardStack} />
          
        </Stack.Navigator>
      );
    }    
    