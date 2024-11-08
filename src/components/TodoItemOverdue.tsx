import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";

interface TodoItemOverdueProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  time: string;
  selected?: boolean;
}

const TodoItem: React.FC<TodoItemOverdueProps> = ({
  id,
  title,
  description,
  completed,
  time,
  selected = false,
}) => {
  return (
    <View
      style={tw`flex-row items-center gap-2 p-4 bg-[#363636] rounded-md h-20 mx-3 my-2`}
    >
      {completed ? (
        <FontAwesome name="check-circle" size={24} color="#8687E7" />
      ) : (
        <AntDesign name="warning" size={24} color="#FB923C" />
      )}
      <View style={tw`flex-1`}>
        <Text style={tw`font-bold text-white`}>{title}</Text>
        <Text numberOfLines={2} style={tw`text-gray-400`}>
          {description}
        </Text>
        <Text style={tw`text-white mt-2 text-xs`}>{time}</Text>
      </View>
      {selected && (
        <View style={tw`p-2 bg-[#8687E7] rounded`}>
          <MaterialIcons name="check" size={24} color="white" />
        </View>
      )}
    </View>
  );
};

export default TodoItem;
