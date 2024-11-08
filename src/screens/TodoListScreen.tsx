import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import {
  CustomModal,
  Header,
  ModalBottom,
  Toast,
  TodoItem,
  TodoItemOverdue,
  TodoItemShimmer,
} from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { formatReadableDate } from "../utils/dateUtils";
import { useFocusEffect } from "@react-navigation/native";
import useTodosStore from "../zustand/todoStore";
import { handleLongPress, handlePress } from "../utils/todoUtils";

type Props = {
  navigation: any;
};

const TodoListScreen = ({ navigation }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [updateTodos, setUpdateTodos] = useState(false);
  const [todoId, setTodoId] = useState("");
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [customModalShow, setCustomModalShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    todos,
    todosOverdue,
    fetchTodos,
    fetchOverdueTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  } = useTodosStore();

  useEffect(() => {
    fetchTodos().then(() => {
      setInitialLoading(false);
    });
    fetchOverdueTodos();
  }, [fetchTodos, fetchOverdueTodos]);

  useFocusEffect(
    React.useCallback(() => {
      fetchTodos();
      fetchOverdueTodos();
    }, [fetchTodos, fetchOverdueTodos])
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

  const handleChecklist = async (id: string) => {
    const todoItem = todos.find((todo) => todo._id === id);
    if (todoItem) {
      await updateTodo(id, { ...todoItem, completed: !todoItem.completed });
      await fetchTodos();
    }
  };

  const handleAddTask = async () => {
    const todoData = {
      title: taskTitle,
      description: taskDescription,
      time: date,
    };

    await createTodo(todoData);
    if (!showToast) {
      setTaskTitle("");
      setTaskDescription("");
      setModalVisible(false);
      fetchTodos();
    }
  };

  const toggleModal = (editTodo: boolean) => {
    setUpdateTodos(editTodo);
    setModalVisible(!isModalVisible);
    setTaskTitle("");
    setTaskDescription("");
    setTodoId("");
  };

  const updateExistingTask = () => {
    updateTodo(todoId, {
      title: taskTitle,
      description: taskDescription,
      time: date,
    });
    setModalVisible(false);
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      mode: "date",
      onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
          setDate(selectedDate);
          showTimepicker(selectedDate);
        }
      },
    });
  };

  const showTimepicker = (selectedDate: Date) => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: "time",
      is24Hour: true,
      onChange: (event: DateTimePickerEvent, selectedTime?: Date) => {
        if (event.type === "set" && selectedTime) {
          const updatedDate = new Date(selectedDate);
          updatedDate.setHours(selectedTime.getHours());
          updatedDate.setMinutes(selectedTime.getMinutes());
          setDate(updatedDate);
        }
      },
    });
  };

  const openLogoutModal = () => {
    setCustomModalShow(true);
  };

  const closeLogoutModal = () => {
    setCustomModalShow(false);
  };

  const confirmDelete = () => {
    deleteTodo(selectedTodos);
    setCustomModalShow(false);
    setSelectedTodos([]);
    setShowDeleteIcon(false);
  };

  return (
    <SafeAreaView style={tw`bg-[#121212] flex-1`}>
      <View style={tw`flex-1`}>
        <Header title="Task" />
        {todos.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-white text-lg`}>Tidak ada task</Text>
          </View>
        ) : (
          <View style={tw`h-100`}>
            <FlatList
              data={todos}
              keyExtractor={(item) => item._id}
              overScrollMode="never"
              bounces={true}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onLongPress={() =>
                    handleLongPress(
                      item._id,
                      selectedTodos,
                      setSelectedTodos,
                      setShowDeleteIcon
                    )
                  }
                  onPress={() =>
                    handlePress(
                      item._id,
                      item.title,
                      item.description,
                      new Date(item.time),
                      selectedTodos,
                      setSelectedTodos,
                      setTodoId,
                      setTaskTitle,
                      setTaskDescription,
                      setShowDeleteIcon,
                      setDate,
                      toggleModal
                    )
                  }
                >
                  <TodoItem
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    completed={item.completed}
                    checklist={() => handleChecklist(item._id)}
                    time={formatReadableDate(new Date(item.time))}
                    selected={selectedTodos.includes(item._id)}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        <View style={tw`justify-center items-start mx-3 my-3`}>
          <Text style={tw`bg-[#363636] text-white p-2 rounded`}>Overdue</Text>
        </View>
        {todosOverdue.length === 0 ? (
          <View style={tw`justify-center items-center flex-1`}>
            <Text style={tw`text-white`}>Tidak ada task overdue</Text>
          </View>
        ) : (
          <FlatList
            data={todosOverdue}
            keyExtractor={(item) => item._id}
            overScrollMode="never"
            bounces={true}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() =>
                  handleLongPress(
                    item._id,
                    selectedTodos,
                    setSelectedTodos,
                    setShowDeleteIcon
                  )
                }
                onPress={() =>
                  handlePress(
                    item._id,
                    item.title,
                    item.description,
                    new Date(item.time),
                    selectedTodos,
                    setSelectedTodos,
                    setTodoId,
                    setTaskTitle,
                    setTaskDescription,
                    setShowDeleteIcon,
                    setDate,
                    toggleModal
                  )
                }
              >
                <TodoItemOverdue
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  completed={item.completed}
                  time={formatReadableDate(new Date(item.time))}
                  selected={selectedTodos.includes(item._id)}
                />
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          onPress={() => {
            toggleModal(false);
          }}
          style={tw`absolute bottom-4 right-4 bg-[#8687E7] p-4 rounded-full`}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
        <ModalBottom
          isVisible={isModalVisible}
          onBackdropPress={() => {
            toggleModal(false);
          }}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          addTask={
            updateTodos === true
              ? () => {
                  updateExistingTask();
                }
              : handleAddTask
          }
          showDatepicker={showDatepicker}
        />
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
      {showToast && (
        <View style={tw`justify-center items-center flex-1 mb-150`}>
          <Toast
            isSuccess={false}
            title="Failed"
            message={
              "The selected date cannot be less than or equal to the current date."
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default TodoListScreen;
