import React, { createContext, useContext, useState, useEffect } from "react";
import { initialUsers, initialTasks, initialNotifications } from "../data/initialData";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  USERS: "taskflow_users",
  TASKS: "taskflow_tasks",
  NOTIFICATIONS: "taskflow_notifications",
  CURRENT_USER: "taskflow_current_user",
  THEME: "taskflow_theme",
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : initialUsers;
  });

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : initialTasks;
  });

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : initialNotifications;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  });

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return stored || "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const login = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      addNotification({
        type: "info",
        message: `Welcome back, ${user.name}!`,
        forAll: false,
        userId: user.id,
      });
      return { success: true, user };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    const userName = currentUser?.name;
    setCurrentUser(null);
    addNotification({
      type: "info",
      message: `${userName} has logged out`,
      forAll: true,
    });
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setTasks((prev) => [...prev, newTask]);
    
    const assignee = users.find((u) => u.id === task.assigneeId);
    addNotification({
      type: "success",
      message: `New task "${task.title}" created and assigned to ${assignee?.name || "Unknown"}`,
      forAll: true,
      taskId: newTask.id,
    });
    
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    
    const task = tasks.find((t) => t.id === taskId);
    addNotification({
      type: "info",
      message: `Task "${task?.title || "Unknown"}" has been updated`,
      forAll: true,
      taskId,
    });
  };

  const deleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    
    addNotification({
      type: "warning",
      message: `Task "${task?.title || "Unknown"}" has been deleted`,
      forAll: true,
    });
  };

  const addComment = (taskId, comment) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      ...comment,
      createdAt: new Date().toISOString(),
      editedAt: null,
    };
    
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...(t.comments || []), newComment] }
          : t
      )
    );
    
    return newComment;
  };

  const updateComment = (taskId, commentId, newText) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: t.comments.map((c) =>
                c.id === commentId
                  ? { ...c, text: newText, editedAt: new Date().toISOString() }
                  : c
              ),
            }
          : t
      )
    );
  };

  const updateUser = (userId, updates) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
    
    addNotification({
      type: "info",
      message: `User profile has been updated`,
      forAll: false,
      userId,
    });
  };

  const getUserTasks = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user?.role === "admin" || user?.role === "manager") {
      return tasks;
    }
    return tasks.filter((t) => t.assigneeId === userId);
  };

  const getTasksByAssignee = (userId) => {
    return tasks.filter((t) => t.assigneeId === userId);
  };

  const getTasksByCreator = (userId) => {
    return tasks.filter((t) => t.createdBy === userId);
  };

  const getUserNotifications = () => {
    if (!currentUser) return [];
    return notifications.filter(
      (n) => n.forAll || n.userId === currentUser.id
    );
  };

  const value = {
    users,
    tasks,
    notifications,
    currentUser,
    theme,
    toggleTheme,
    login,
    logout,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    updateComment,
    updateUser,
    getUserTasks,
    getTasksByAssignee,
    getTasksByCreator,
    getUserNotifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
