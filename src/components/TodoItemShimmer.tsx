import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

const TodoItemShimmer: React.FC = () => {
  return (
    <View
      style={tw`flex-row items-center gap-2 p-4 bg-[#363636] rounded-md h-20 mx-3 my-2`}
    >
      <ShimmerPlaceHolder style={tw`w-6 h-6 rounded-full`} />

      <View style={tw`flex-1 `}>
        <ShimmerPlaceHolder style={tw`h-4 w-1/2 bg-gray-700 mb-2 rounded`} />
        <ShimmerPlaceHolder style={tw`h-3 w-full bg-gray-700 mb-2 rounded`} />
        <ShimmerPlaceHolder style={tw`h-3 w-1/4 bg-gray-700 rounded`} />
      </View>
    </View>
  );
};

export default TodoItemShimmer;
