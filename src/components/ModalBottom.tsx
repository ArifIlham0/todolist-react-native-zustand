import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import tw from "twrnc";
import { Entypo, Ionicons } from "@expo/vector-icons";

type Props = {
  isVisible: boolean;
  onBackdropPress: () => void;
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  taskDescription: string;
  setTaskDescription: (description: string) => void;
  addTask: () => void;
  showDatepicker: () => void;
};

const ModalBottom = ({
  isVisible,
  onBackdropPress,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  addTask,
  showDatepicker,
}: Props) => {
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleAddTask = () => {
    if (!taskTitle) {
      setTitleError("Task title is required");
    } else {
      setTitleError("");
    }

    if (!taskDescription) {
      setDescriptionError("Task description is required");
    } else {
      setDescriptionError("");
    }

    if (taskTitle && taskDescription) {
      addTask();
    }
  };

  const handleBackdrop = () => {
    setTitleError("");
    setDescriptionError("");
    onBackdropPress();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleBackdrop}
      style={tw`justify-end m-0`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`bg-[#363636] p-4 rounded-lg`}
      >
        <Text style={tw`text-lg text-white font-bold mb-2`}>Add Task</Text>
        <TextInput
          style={tw`border border-white p-2 mt-4 rounded text-white`}
          placeholder="Task Title"
          placeholderTextColor={"gray"}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        {titleError ? <Text style={tw`text-red-500`}>{titleError}</Text> : null}
        <TextInput
          style={tw`border border-white p-2 mt-4 rounded text-white`}
          placeholder="Description"
          placeholderTextColor={"gray"}
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
        />
        {descriptionError ? (
          <Text style={tw`text-red-500`}>{descriptionError}</Text>
        ) : null}
        <View style={tw`flex-row justify-between my-4 mx-3`}>
          <TouchableOpacity onPress={showDatepicker}>
            <Entypo name="stopwatch" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddTask}>
            <Ionicons name="send" size={24} color="#8687E7" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalBottom;
