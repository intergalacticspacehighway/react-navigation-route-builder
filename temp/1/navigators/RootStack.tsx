
    import React from "react";
    import { createStackNavigator } from '@react-navigation/stack';
    
  import { Notifications, Messages, Explore, Bookmarks } from "../screens";  
  import {Profile} from "./Profile"
  
    
    const Stack = createStackNavigator();
    
    export function RootStack() {
      return (
        <Stack.Navigator>
        <Stack.Screen name="Profile" component={Profile} />
<Stack.Screen name="Notifications" component={Notifications} />
<Stack.Screen name="Messages" component={Messages} />
<Stack.Screen name="Explore" component={Explore} />
<Stack.Screen name="Bookmarks" component={Bookmarks} />
          
        </Stack.Navigator>
      );
    }    
    