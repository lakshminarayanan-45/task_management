import React, { useState } from "react";
import { Plus, GripVertical, MessageSquare, Calendar, Edit2, Check, X, Send } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "../context/AppContext";
import CreateTaskModal from "../components/common/CreateTaskModal";
import TaskModal from "../components/common/TaskModal";
import { toast } from "sonner";

const columns = [
  { id: "todo", title: "To Do", color: "bg-muted" },
  { id: "in-progress", title: "In Progress", color: "bg-info/20" },
  { id: "in-review", title: "In Review", color: "bg-warning/20" },
  { id: "completed", title: "Completed", color: "bg-success/20" },
];

export default function Kanban() {
  const { currentUser, getUserTasks, updateTask, users, addComment, updateComment } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [newComments, setNewComments] = useState({});

  const allTasks = currentUser ? getUserTasks(currentUser.id) : [];
  const canCreateTask = currentUser?.role === "admin" || currentUser?.role === "manager";

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
      toast.success(`Task moved to ${columns.find((c) => c.id === status)?.title}`);
    }
    setDraggedTask(null);
  };

  const toggleComments = (taskId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const startEditComment = (taskId, comment) => {
    setEditingComment({ taskId, commentId: comment.id });
    setEditedCommentText(comment.text);
  };

  const saveEditedComment = () => {
    if (!editingComment || !editedCommentText.trim()) return;
    updateComment(editingComment.taskId, editingComment.commentId, editedCommentText);
    setEditingComment(null);
    setEditedCommentText("");
    toast.success("Comment updated");
  };

  const handleAddComment = (taskId) => {
    const text = newComments[taskId];
    if (!text?.trim()) return;
    
    addComment(taskId, {
      text,
      authorId: currentUser.id,
    });
    setNewComments((prev) => ({ ...prev, [taskId]: "" }));
    toast.success("Comment added");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop tasks to update their status
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {columns.map((column) => {
          const columnTasks = allTasks.filter((t) => t.status === column.id);
          
          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`min-h-96 rounded-xl ${column.color} p-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-background text-sm font-medium text-foreground">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const assignee = users.find((u) => u.id === task.assigneeId);
                  const isExpanded = expandedComments[task.id];
                  
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="bg-card border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p
                            onClick={() => setSelectedTask(task)}
                            className="font-medium text-foreground text-sm cursor-pointer hover:text-primary transition-colors"
                          >
                            {task.title}
                          </p>
                          
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            )}
                            <button
                              onClick={() => toggleComments(task.id)}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              {task.comments?.length || 0}
                            </button>
                          </div>

                          {assignee && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] text-primary-foreground font-medium">
                                {assignee.name.charAt(0)}
                              </div>
                              <span className="text-xs text-muted-foreground">{assignee.name}</span>
                            </div>
                          )}

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-border space-y-2">
                              {task.comments?.map((comment) => {
                                const author = users.find((u) => u.id === comment.authorId);
                                const isEditing = editingComment?.commentId === comment.id;
                                const canEdit = comment.authorId === currentUser?.id;
                                
                                return (
                                  <div key={comment.id} className="bg-accent/50 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-foreground">
                                        {author?.name}
                                      </span>
                                      {canEdit && !isEditing && (
                                        <button
                                          onClick={() => startEditComment(task.id, comment)}
                                          className="p-0.5 rounded hover:bg-accent"
                                        >
                                          <Edit2 className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                      )}
                                    </div>
                                    
                                    {isEditing ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="text"
                                          value={editedCommentText}
                                          onChange={(e) => setEditedCommentText(e.target.value)}
                                          className="flex-1 text-xs p-1 rounded bg-background border border-input"
                                          autoFocus
                                        />
                                        <button
                                          onClick={saveEditedComment}
                                          className="p-1 rounded bg-primary text-primary-foreground"
                                        >
                                          <Check className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => setEditingComment(null)}
                                          className="p-1 rounded bg-muted"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <p className="text-xs text-muted-foreground">{comment.text}</p>
                                        {comment.editedAt && (
                                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                                            (edited {format(new Date(comment.editedAt), "MMM d, h:mm a")})
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                              
                              <div className="flex items-center gap-1 mt-2">
                                <input
                                  type="text"
                                  value={newComments[task.id] || ""}
                                  onChange={(e) => setNewComments((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                  placeholder="Add comment..."
                                  className="flex-1 text-xs p-1.5 rounded bg-background border border-input"
                                  onKeyDown={(e) => e.key === "Enter" && handleAddComment(task.id)}
                                />
                                <button
                                  onClick={() => handleAddComment(task.id)}
                                  className="p-1.5 rounded bg-primary text-primary-foreground"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
