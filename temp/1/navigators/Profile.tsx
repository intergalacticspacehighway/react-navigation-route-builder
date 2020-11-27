
    import React from "react";
    import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

    
  import { Tweets, TweetsAndReplies, Media, Likes } from "../screens";  
  
  
 
    const Tab = createMaterialTopTabNavigator();
    
    export function Profile() {
      return (
        <Tab.Navigator>
        <Tab.Screen name="Tweets" component={Tweets} />
<Tab.Screen name="TweetsAndReplies" component={TweetsAndReplies} />
<Tab.Screen name="Media" component={Media} />
<Tab.Screen name="Likes" component={Likes} />
          
        </Tab.Navigator>
      );
    }    
    