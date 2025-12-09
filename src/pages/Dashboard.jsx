import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Plus,
  LayoutGrid,
  List,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/common/TaskCard";
import TaskModal from "../components/common/TaskModal";
import CreateTaskModal from "../components/common/CreateTaskModal";
import CalendarWidget from "../components/common/CalendarWidget";

const statCards = [
  { key: "total", label: "Total Tasks", icon: ListTodo, color: "primary" },
  { key: "in-progress", label: "In Progress", icon: Clock, color: "info" },
  { key: "in-review", label: "In Review", icon: AlertCircle, color: "warning" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "success" },
];

export default function Dashboard() {
  const { searchQuery } = useOutletContext();
  const navigate = useNavigate();
  const { currentUser, getUserTasks, users } = useApp();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateTasksModal, setDateTasksModal] = useState({ open: false, date: null, tasks: [] });

  const allTasks = currentUser ? getUserTasks(currentUser.id) : [];
  
  const filteredTasks = allTasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const assignee = users.find((u) => u.id === task.assigneeId);
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      assignee?.name.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: filteredTasks.length,
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress").length,
    "in-review": filteredTasks.filter((t) => t.status === "in-review").length,
    completed: filteredTasks.filter((t) => t.status === "completed").length,
  };

  const getStatTasks = (key) => {
    if (key === "total") return filteredTasks;
    return filteredTasks.filter((t) => t.status === key);
  };

  const recentTasks = filteredTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const handleDateSelect = (date, tasks) => {
    setSelectedDate(date);
    if (tasks.length > 0) {
      setDateTasksModal({ open: true, date, tasks });
    }
  };

  const canCreateTask = currentUser?.role === "admin" || currentUser?.role === "manager";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, {currentUser?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your tasks
          </p>
        </div>

        {canCreateTask && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isSelected = selectedStat === stat.key;
          
          return (
            <button
              key={stat.key}
              onClick={() => setSelectedStat(isSelected ? null : stat.key)}
              className={`stat-card text-left animate-fade-in ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "primary" ? "bg-primary/10" :
                  stat.color === "info" ? "bg-info/10" :
                  stat.color === "warning" ? "bg-warning/10" :
                  "bg-success/10"
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === "primary" ? "text-primary" :
                    stat.color === "info" ? "text-info" :
                    stat.color === "warning" ? "text-warning" :
                    "text-success"
                  }`} />
                </div>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats[stat.key]}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </button>
          );
        })}
      </div>

      {selectedStat && (
        <div className="bg-card border border-border rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {statCards.find((s) => s.key === selectedStat)?.label} ({getStatTasks(selectedStat).length})
            </h3>
            <button
              onClick={() => setSelectedStat(null)}
              className="text-sm text-primary hover:underline"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getStatTasks(selectedStat).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Tasks</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTasks.map((task, index) => (
                <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TaskCard task={task} onClick={() => setSelectedTask(task)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {recentTasks.map((task, index) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="w-full p-4 flex items-center justify-between gap-4 hover:bg-accent/50 transition-colors text-left animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{assignee?.name}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
                      task.priority === "high" ? "bg-destructive/10 text-destructive" :
                      task.priority === "medium" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      {task.priority}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {recentTasks.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}
        </div>

        <div>
          <CalendarWidget
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>

      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {dateTasksModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setDateTasksModal({ open: false, date: null, tasks: [] })}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Tasks due on {dateTasksModal.date && new Date(dateTasksModal.date).toLocaleDateString()}
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {dateTasksModal.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => {
                    setDateTasksModal({ open: false, date: null, tasks: [] });
                    setSelectedTask(task);
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setDateTasksModal({ open: false, date: null, tasks: [] })}
              className="w-full mt-4 btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
