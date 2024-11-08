import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../zustand/authStore";

type Props = {};

const SplashScreen = (props: Props) => {
  const [authChecked, setAuthChecked] = useState(false);
  const navigation = useNavigation();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const authenticate = async () => {
      try {
        let success = await checkAuth();

        if (success) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" } as any],
          });
        } else {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" } as any],
          });
        }
      } catch (error) {
        console.log("Error auth me:", error);

        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" } as any],
        });

        console.log("Error auth me:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    authenticate();
  }, [checkAuth, navigation]);

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Image source={require("../../assets/logosplash.png")} />
    </View>
  );
};

export default SplashScreen;
