import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";
import { useApp } from "../../context/AppContext";

export default function CalendarWidget({ onDateSelect, selectedDate }) {
  const { tasks, currentUser, getUserTasks } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const userTasks = currentUser ? getUserTasks(currentUser.id) : tasks;
  const today = startOfDay(new Date());

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date) => {
    return userTasks.filter((task) => {
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

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day" />
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
              onClick={() => !isPast && onDateSelect?.(day, tasksOnDay)}
              disabled={isPast}
              className={`calendar-day ${
                isSelected ? "calendar-day-active" : ""
              } ${hasTask && !isPast ? "calendar-day-has-task" : ""} ${
                isPast ? "calendar-day-disabled" : ""
              } ${isToday && !isSelected ? "ring-2 ring-primary/50" : ""}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-2">
            {format(selectedDate, "MMMM d, yyyy")}
          </p>
          {getTasksForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  className="p-2 rounded-lg bg-accent/50 text-sm text-foreground"
                >
                  {task.title}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tasks due</p>
          )}
        </div>
      )}
    </div>
  );
}
