export const handleLongPress = (
  id: string,
  selectedTodos: string[],
  setSelectedTodos: React.Dispatch<React.SetStateAction<string[]>>,
  setShowDeleteIcon: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!selectedTodos.includes(id)) {
    setSelectedTodos((prev) => [...prev, id]);
    setShowDeleteIcon(true);
  }
};

export const handlePress = (
  id: string,
  title: string,
  description: string,
  time: Date,
  selectedTodos: string[],
  setSelectedTodos: React.Dispatch<React.SetStateAction<string[]>>,
  setTodoId: React.Dispatch<React.SetStateAction<string>>,
  setTaskTitle: React.Dispatch<React.SetStateAction<string>>,
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>,
  setShowDeleteIcon: React.Dispatch<React.SetStateAction<boolean>>,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
  toggleModal: (isVisible: boolean) => void
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
  } else {
    toggleModal(true);
    setTodoId(id);
    setTaskTitle(title);
    setTaskDescription(description);
    setDate(new Date(time));
  }
};

export const deleteSelectedTodos = async (
  selectedTodos: string[],
  setSelectedTodos: React.Dispatch<React.SetStateAction<string[]>>,
  setShowDeleteIcon: React.Dispatch<React.SetStateAction<boolean>>,
  deleteTodo: (selectedTodos: string[]) => Promise<void>,
  fetchTodos: () => void,
  fetchOverdueTodos: () => void
) => {
  try {
    await deleteTodo(selectedTodos);
    setSelectedTodos([]);
    setShowDeleteIcon(false);
    fetchTodos();
    fetchOverdueTodos();
  } catch (error) {
    console.log("Error deleting todos: ", error);
  }
};
