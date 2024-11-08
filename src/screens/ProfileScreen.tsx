import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { CustomModal, Header } from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTodosStore from "../zustand/todoStore";

type Props = {
  navigation: any;
};

const ProfileScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    todos,
    todosOverdue,
    todosComplete,
    isLoading,
    fetchTodos,
    fetchOverdueTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  } = useTodosStore();

  useEffect(() => {
    const fetchStorage = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      setUsername(storedUsername);
    };

    fetchStorage();
  }, []);

  if (isLoading) {
    return (
      <View style={tw`bg-[#121212] flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const openLogoutModal = () => {
    setModalVisible(true);
  };

  const closeLogoutModal = () => {
    setModalVisible(false);
  };

  const confirmLogout = () => {
    setModalVisible(false);
    logout();
  };

  return (
    <SafeAreaView style={tw`bg-[#121212] flex-1`}>
      <View style={tw`flex-1`}>
        <Header title="Profile" />
        <View style={tw`justify-center items-center`}>
          <Text style={tw`text-white text-xl font-bold mt-5`}>Username</Text>
          <Text style={tw`text-white text-xl mt-2`}>{username}</Text>
          <View style={tw`flex-row mt-10`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Main", {
                  screen: "TodoList",
                })
              }
              style={tw`bg-[#363636] rounded-md p-4 mx-4`}
            >
              <Text style={tw`text-white text-center mx-2`}>
                {todos.length} Task left
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Main", {
                  screen: "Completed",
                })
              }
              style={tw`bg-[#363636] rounded-md p-4 mx-4`}
            >
              <Text style={tw`text-white text-center mx-2`}>
                {todosComplete.length} Task done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={openLogoutModal}>
        <View style={tw`flex-row items-center justify-center pb-20`}>
          <MaterialCommunityIcons
            name="exit-to-app"
            size={40}
            color="#FF4949"
          />
          <Text style={tw`text-[#FF4949] text-2xl ml-2`}>Logout</Text>
        </View>
      </TouchableOpacity>
      <CustomModal
        taskTitle="Are you sure want to logout?"
        visible={modalVisible}
        onClose={closeLogoutModal}
        onAccept={confirmLogout}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
