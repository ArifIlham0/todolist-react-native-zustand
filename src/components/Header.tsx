import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

type Props = {
  title: string;
};

const Header = ({ title }: Props) => {
  return (
    <View style={tw`justify-center items-center my-2`}>
      <Text style={tw`text-white font-bold text-2xl `}>{title}</Text>
    </View>
  );
};

export default Header;
