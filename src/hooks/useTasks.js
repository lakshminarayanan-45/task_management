import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform to match existing app structure
      const transformedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status || "todo",
        priority: task.priority || "medium",
        assigneeId: task.assignee_id,
        createdBy: task.creator_id,
        dueDate: task.due_date,
        createdAt: task.created_at,
        comments: [],
      }));
      
      setTasks(transformedTasks);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new task
  const addTask = async (task) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: task.title,
          description: task.description,
          status: task.status || "todo",
          priority: task.priority || "medium",
          assignee_id: task.assigneeId,
          creator_id: task.createdBy,
          due_date: task.dueDate,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assignee_id,
        createdBy: data.creator_id,
        dueDate: data.due_date,
        createdAt: data.created_at,
        comments: [],
      };

      setTasks((prev) => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      console.error("Error adding task:", err);
      return { success: false, error: err.message };
    }
  };

  // Update a task
  const updateTask = async (taskId, updates) => {
    try {
      const dbUpdates = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.assigneeId !== undefined) dbUpdates.assignee_id = updates.assigneeId;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

      const { error } = await supabase
        .from("tasks")
        .update(dbUpdates)
        .eq("id", taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating task:", err);
      return { success: false, error: err.message };
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting task:", err);
      return { success: false, error: err.message };
    }
  };

  // Subscribe to realtime changes
  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("Realtime update:", payload);
          if (payload.eventType === "INSERT") {
            const task = payload.new;
            const newTask = {
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              assigneeId: task.assignee_id,
              createdBy: task.creator_id,
              dueDate: task.due_date,
              createdAt: task.created_at,
              comments: [],
            };
            setTasks((prev) => {
              if (prev.find((t) => t.id === task.id)) return prev;
              return [newTask, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const task = payload.new;
            setTasks((prev) =>
              prev.map((t) =>
                t.id === task.id
                  ? {
                      ...t,
                      title: task.title,
                      description: task.description,
                      status: task.status,
                      priority: task.priority,
                      assigneeId: task.assignee_id,
                      dueDate: task.due_date,
                    }
                  : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
