import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export default function DatePickerCalendar({ selectedDate, onSelect, minDate }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const today = startOfDay(new Date());
  const minimumDate = minDate || today;

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth();
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (!isBefore(startOfMonth(prevMonth), startOfMonth(minimumDate))) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isPastDate = (date) => isBefore(date, minimumDate);
  const canGoPrev = !isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(minimumDate));

  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8" />
        ))}
        
        {days.map((day) => {
          const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
          const isToday = isSameDay(day, new Date());
          const isPast = isPastDate(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => !isPast && onSelect(format(day, "yyyy-MM-dd"))}
              disabled={isPast}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isPast
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "hover:bg-accent text-foreground"
              } ${isToday && !isSelected ? "ring-1 ring-primary/50" : ""}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
