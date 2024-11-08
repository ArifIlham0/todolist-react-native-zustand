import { View, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

type Props = {
  isSuccess: boolean;
  title: string;
  message: string;
};

const Toast = ({ isSuccess, title, message }: Props) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={tw`absolute top-20 bg-red-600 w-5/6 border rounded p-3 flex-row justify-start items-center shadow-black`}
    >
      {isSuccess === true ? (
        <Feather name="check" size={24} color="white" />
      ) : (
        <Feather name="alert-circle" size={24} color="white" />
      )}
      <View>
        <Text style={tw`text-white font-bold ml-5 text-lg`}>{title}</Text>
        <Text style={tw`text-white font-semibold ml-5 text-base`}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
