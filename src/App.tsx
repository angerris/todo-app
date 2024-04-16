import React, { useEffect, useState } from "react";
import { Button, Input, List, Checkbox, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./App.module.scss";

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}
const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(todos).length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTodo = () => {
    if (inputText.trim() === "") return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText.trim(),
      done: false
    };
    setTodos([newTodo, ...todos]);
    setInputText("");
  };
  const handleDeleteTodo = (id: any) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEditTodo = (id: number, newText: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newText };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
  const handleToggleDone = (id: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });
    const sortedTodos = [...updatedTodos].sort((a, b) => {
      if (a.done && !b.done) return 1;
      if (!a.done && b.done) return -1;
      return 0;
    });

    setTodos(sortedTodos);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.todoWrapper}>
        <div className={styles.topWrapper}>
          {" "}
          <h1 className={styles.title}>todos</h1>
          <div className={styles.inputWrapper}>
            <Input
              placeholder="enter todo item"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleAddTodo}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddTodo}
            >
              add
            </Button>
          </div>
        </div>
        {todos.length > 0 && (
          <List
            className={styles.taskWrapper}
            dataSource={todos}
            renderItem={(todo) => (
              <List.Item
                actions={[
                  <Space>
                    {editingId !== todo.id ? (
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditedText(todo.text);
                        }}
                      />
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => handleEditTodo(todo.id, editedText)}
                      >
                        OK
                      </Button>
                    )}
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteTodo(todo.id)}
                    />
                    <Checkbox
                      checked={todo.done}
                      onChange={() => handleToggleDone(todo.id)}
                    />
                  </Space>
                ]}
              >
                {todo.id === editingId ? (
                  <Input
                    value={todo.text}
                    autoFocus
                    onChange={(e) => handleEditTodo(todo.id, e.target.value)}
                    onPressEnter={() => setEditingId(0)}
                    onBlur={() => setEditingId(0)}
                  />
                ) : todo.done ? (
                  <p className={styles.todoText}>
                    {" "}
                    <del>{todo.text} </del>
                  </p>
                ) : (
                  <p className={styles.todoText}> {todo.text}</p>
                )}
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default App;
