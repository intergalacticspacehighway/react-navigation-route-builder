
    import React from "react";
    import { createStackNavigator } from '@react-navigation/stack';
    
  import { OpenAlert } from "../screens";  
  
  
    
    const Stack = createStackNavigator();
    
    export function DashboardStack() {
      return (
        <Stack.Navigator>
        <Stack.Screen name="OpenAlert" component={OpenAlert} />
          
        </Stack.Navigator>
      );
    }    
    