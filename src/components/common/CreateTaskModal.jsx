import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Calendar, User, Flag } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import DatePickerCalendar from "./DatePickerCalendar";
import { validateTaskTitle, validateTaskDescription, validateRequired } from "../../utils/validation";

const priorityOptions = [
  { value: "high", label: "High", icon: Flag },
  { value: "medium", label: "Medium", icon: Flag },
  { value: "low", label: "Low", icon: Flag },
];

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
];

export default function CreateTaskModal({ isOpen, onClose }) {
  const { users, currentUser, addTask } = useApp();
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigneeId: "",
    dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const minDate = startOfDay(addDays(new Date(), 1));

  const validateForm = () => {
    const newErrors = {};
    
    const titleValidation = validateTaskTitle(formData.title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error;
    }
    
    const descValidation = validateTaskDescription(formData.description);
    if (!descValidation.valid) {
      newErrors.description = descValidation.error;
    }
    
    const assigneeValidation = validateRequired(formData.assigneeId, "Assignee");
    if (!assigneeValidation.valid) {
      newErrors.assigneeId = assigneeValidation.error;
    }
    
    const selectedDate = new Date(formData.dueDate);
    if (isBefore(selectedDate, startOfDay(new Date()))) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    addTask({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      createdBy: currentUser.id,
    });

    toast.success("Task created successfully");
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: "",
      dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    });
    setErrors({});
    onClose();
  };

  const handleDateSelect = (date) => {
    setFormData({ ...formData, dueDate: date });
    setShowCalendar(false);
    if (errors.dueDate) {
      setErrors({ ...errors, dueDate: null });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              className={`input-field ${errors.title ? "border-destructive" : ""}`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              rows={2}
              className={`input-field resize-none ${errors.description ? "border-destructive" : ""}`}
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                <User className="w-4 h-4 inline mr-1" />
                Assignee
              </label>
              <select
                value={formData.assigneeId}
                onChange={(e) => {
                  setFormData({ ...formData, assigneeId: e.target.value });
                  if (errors.assigneeId) setErrors({ ...errors, assigneeId: null });
                }}
                className={`input-field ${errors.assigneeId ? "border-destructive" : ""}`}
              >
                <option value="">Select assignee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              {errors.assigneeId && (
                <p className="text-xs text-destructive mt-1">{errors.assigneeId}</p>
              )}
            </div>

            <div className="relative" ref={calendarRef}>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`input-field text-left flex items-center justify-between ${errors.dueDate ? "border-destructive" : ""}`}
              >
                <span>{format(new Date(formData.dueDate), "MMM d, yyyy")}</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </button>
              {errors.dueDate && (
                <p className="text-xs text-destructive mt-1">{errors.dueDate}</p>
              )}
              
              {showCalendar && (
                <div className="absolute top-full left-0 mt-1 z-50">
                  <DatePickerCalendar
                    selectedDate={formData.dueDate}
                    onSelect={handleDateSelect}
                    minDate={minDate}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: opt.value })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      formData.priority === opt.value
                        ? opt.value === "high"
                          ? "bg-destructive text-destructive-foreground"
                          : opt.value === "medium"
                          ? "bg-warning text-warning-foreground"
                          : "bg-success text-success-foreground"
                        : "bg-accent text-muted-foreground hover:bg-accent/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
