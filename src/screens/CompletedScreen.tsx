import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { CustomModal, Header, TodoItem, TodoItemShimmer } from "../components";
import { formatReadableDate } from "../utils/dateUtils";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import useTodosStore from "../zustand/todoStore";

type Props = {
  navigation: any;
};

const CompletedScreen = ({ navigation }: Props) => {
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [customModalShow, setCustomModalShow] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const {
    todos,
    todosOverdue,
    isLoading,
    fetchTodos,
    fetchOverdueTodos,
    deleteTodo,
    fetchCompleteTodos,
    todosComplete,
  } = useTodosStore();

  useEffect(() => {
    fetchCompleteTodos().then(() => {
      setInitialLoading(false);
    });
  }, [fetchCompleteTodos]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCompleteTodos();
    }, [fetchCompleteTodos])
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={tw`bg-[#121212] flex-1`}>
        <View style={tw`flex-1 bg-[#121212]`}>
          <Header title="Task" />
          <View style={tw`bg-[#121212] flex-1 justify-start items-center`}>
            <TodoItemShimmer />
            <TodoItemShimmer />
            <TodoItemShimmer />
            <TodoItemShimmer />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleLongPress = (id: string) => {
    if (!selectedTodos.includes(id)) {
      setSelectedTodos((prev) => [...prev, id]);
      setShowDeleteIcon(true);
    }
  };

  const handlePress = (
    id: string,
    title: string,
    description: string,
    time: Date
  ) => {
    if (selectedTodos.length > 0) {
      if (selectedTodos.includes(id)) {
        setSelectedTodos((prev) => {
          const newSelectedTodos = prev.filter((todoId) => todoId !== id);
          if (newSelectedTodos.length === 0) {
            setShowDeleteIcon(false);
          }
          return newSelectedTodos;
        });
      } else {
        setSelectedTodos((prev) => [...prev, id]);
      }
    }
  };

  const deleteSelectedTodos = () => {
    try {
      deleteTodo(selectedTodos);
      setCustomModalShow(false);
      setSelectedTodos([]);
      setShowDeleteIcon(false);
    } catch (error) {
      console.log("Error deleting todos: ", error);
    }
  };

  const openLogoutModal = () => {
    setCustomModalShow(true);
  };

  const closeLogoutModal = () => {
    setCustomModalShow(false);
  };

  const confirmDelete = () => {
    setCustomModalShow(false);
    deleteSelectedTodos();
  };

  return (
    <SafeAreaView style={tw`bg-[#121212] flex-1`}>
      <View style={tw`flex-1`}>
        <Header title="Completed Task" />
        {todosComplete.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-white text-lg`}>Tidak ada task</Text>
          </View>
        ) : (
          <FlatList
            data={todosComplete}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            overScrollMode="never"
            bounces={true}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item._id)}
                onPress={() =>
                  handlePress(
                    item._id,
                    item.title,
                    item.description,
                    new Date(item.time)
                  )
                }
              >
                <TodoItem
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  completed={item.completed}
                  time={formatReadableDate(new Date(item.time))}
                  checklist={() => {}}
                  selected={selectedTodos.includes(item._id)}
                />
              </TouchableOpacity>
            )}
          />
        )}
        {showDeleteIcon && (
          <TouchableOpacity
            onPress={openLogoutModal}
            style={tw`absolute bottom-4 left-4 bg-[#FF6347] p-4 rounded-full`}
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        )}
        <CustomModal
          taskTitle="Are you sure want to delete this todos?"
          visible={customModalShow}
          onClose={closeLogoutModal}
          onAccept={confirmDelete}
        />
      </View>
    </SafeAreaView>
  );
};

export default CompletedScreen;
