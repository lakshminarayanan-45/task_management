import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/common/TaskCard";
import TaskModal from "../components/common/TaskModal";
import CreateTaskModal from "../components/common/CreateTaskModal";

export default function CalendarPage() {
  const { currentUser, getUserTasks, users } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const allTasks = currentUser ? getUserTasks(currentUser.id) : [];
  const today = startOfDay(new Date());
  const canCreateTask = currentUser?.role === "admin" || currentUser?.role === "manager";

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date) => {
    return allTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, date);
    });
  };

  const days = getDaysInMonth();
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (!isBefore(startOfMonth(prevMonth), startOfMonth(new Date()))) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isPastDate = (date) => isBefore(date, today);
  const canGoPrev = !isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(new Date()));

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View tasks by their due dates
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                disabled={!canGoPrev}
                className="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {days.map((day) => {
              const tasksOnDay = getTasksForDate(day);
              const hasTask = tasksOnDay.length > 0;
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isPast = isPastDate(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !isPast && setSelectedDate(day)}
                  disabled={isPast}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isPast
                      ? "bg-muted/50 text-muted-foreground/40 cursor-not-allowed"
                      : "hover:bg-accent"
                  } ${isToday && !isSelected ? "ring-2 ring-primary/50" : ""}`}
                >
                  <span className="text-sm font-medium">{format(day, "d")}</span>
                  {hasTask && !isPast && (
                    <div className="flex gap-0.5 mt-1">
                      {tasksOnDay.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-primary-foreground" : "bg-primary"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Select a date"}
          </h3>

          {selectedDate ? (
            selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tasks due on this date</p>
                {canCreateTask && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-secondary text-sm"
                  >
                    Create a task
                  </button>
                )}
              </div>
            )
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Click on a date to view tasks
            </p>
          )}
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
    </div>
  );
}
