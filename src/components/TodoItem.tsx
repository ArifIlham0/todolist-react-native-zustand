import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  time: string;
  checklist?: (id: string) => void;
  selected?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  description,
  completed,
  checklist,
  time,
  selected = false,
}) => {
  return (
    <View
      style={tw`flex-row items-center gap-2 p-4 bg-[#363636] rounded-md h-20 mx-3 my-2`}
    >
      <TouchableOpacity onPress={() => checklist!(id)}>
        {completed ? (
          <FontAwesome name="check-circle" size={24} color="#8687E7" />
        ) : (
          <Entypo name="circle" size={24} color="gray" />
        )}
      </TouchableOpacity>
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
