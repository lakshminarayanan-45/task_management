import React from "react";
import { Calendar, User, MessageSquare, Flag } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "../../context/AppContext";

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-info/10 text-info",
  "in-review": "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  completed: "Completed",
};

export default function TaskCard({ task, onClick, showAssignee = true }) {
  const { users } = useApp();
  const assignee = users.find((u) => u.id === task.assigneeId);

  return (
    <div
      onClick={onClick}
      className="task-card group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {task.title}
        </h3>
        <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[task.priority]}`}>
          <Flag className="w-3 h-3 inline mr-1" />
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}
          
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>

      {showAssignee && assignee && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-primary-foreground font-medium">
            {assignee.name.charAt(0)}
          </div>
          <span className="text-xs text-muted-foreground">{assignee.name}</span>
        </div>
      )}
    </div>
  );
}
