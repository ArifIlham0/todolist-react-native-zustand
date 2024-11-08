import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import {
  CompletedScreen,
  LoginScreen,
  ProfileScreen,
  RegisterScreen,
  SplashScreen,
  TodoListScreen,
} from "./screens";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#363636" },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TodoList"
        component={TodoListScreen}
        options={{
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="book-check"
                color={color}
                size={size}
              />
            ) : (
              <MaterialCommunityIcons
                name="book-check-outline"
                color={color}
                size={size}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedScreen}
        options={{
          tabBarLabel: "Completed",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="checkbox-multiple-marked-circle"
                color={color}
                size={size}
              />
            ) : (
              <MaterialCommunityIcons
                name="checkbox-multiple-marked-circle-outline"
                color={color}
                size={size}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Octicons name="person-fill" color={color} size={size} />
            ) : (
              <Octicons name="person" color={color} size={size} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#121212" },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
