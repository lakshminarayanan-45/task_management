import React, { useState, useEffect } from "react";
import { X, Calendar, User, Flag, MessageSquare, Edit2, Trash2, Check, Send } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

const priorityOptions = ["high", "medium", "low"];
const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "completed", label: "Completed" },
];

export default function TaskModal({ task, isOpen, onClose, mode = "view" }) {
  const { users, currentUser, updateTask, deleteTask, addComment, updateComment } = useApp();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editedTask, setEditedTask] = useState(task);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const assignee = users.find((u) => u.id === task.assigneeId);
  const creator = users.find((u) => u.id === task.createdBy);

  const handleSave = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
    toast.success("Task updated successfully");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      toast.success("Task deleted successfully");
      onClose();
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    addComment(task.id, {
      text: newComment,
      authorId: currentUser.id,
    });
    setNewComment("");
    toast.success("Comment added");
  };

  const handleSaveComment = (commentId) => {
    if (!editedCommentText.trim()) return;
    
    updateComment(task.id, commentId, editedCommentText);
    setEditingCommentId(null);
    setEditedCommentText("");
    toast.success("Comment updated");
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && currentUser?.role !== "employee" && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                  <select
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                    className="input-field"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
                  <select
                    value={editedTask.priority}
                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                    className="input-field"
                  >
                    {priorityOptions.map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Assignee</label>
                  <select
                    value={editedTask.assigneeId}
                    onChange={(e) => setEditedTask({ ...editedTask, assigneeId: e.target.value })}
                    className="input-field"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={editedTask.dueDate}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-muted-foreground">{task.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Flag className="w-4 h-4" />
                    Priority
                  </div>
                  <span className="font-medium text-foreground capitalize">{task.priority}</span>
                </div>

                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </div>
                  <span className="font-medium text-foreground">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date set"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <User className="w-4 h-4" />
                    Assignee
                  </div>
                  <span className="font-medium text-foreground">{assignee?.name || "Unassigned"}</span>
                </div>

                <div className="p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <User className="w-4 h-4" />
                    Created By
                  </div>
                  <span className="font-medium text-foreground">{creator?.name || "Unknown"}</span>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <MessageSquare className="w-4 h-4" />
                  Comments ({task.comments?.length || 0})
                </h4>

                <div className="space-y-3 mb-4">
                  {task.comments?.map((comment) => {
                    const author = users.find((u) => u.id === comment.authorId);
                    const isOwn = comment.authorId === currentUser?.id;
                    const isEditing = editingCommentId === comment.id;

                    return (
                      <div key={comment.id} className="p-3 rounded-lg bg-accent/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-primary-foreground font-medium">
                              {author?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-sm font-medium text-foreground">{author?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                            </span>
                            {comment.editedAt && (
                              <span className="text-xs text-muted-foreground">(edited)</span>
                            )}
                          </div>
                          
                          {isOwn && !isEditing && (
                            <button
                              onClick={() => startEditingComment(comment)}
                              className="p-1 rounded hover:bg-accent transition-colors"
                            >
                              <Edit2 className="w-3 h-3 text-muted-foreground" />
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editedCommentText}
                              onChange={(e) => setEditedCommentText(e.target.value)}
                              className="flex-1 input-field text-sm py-1.5"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveComment(comment.id)}
                              className="p-1.5 rounded-lg bg-primary text-primary-foreground"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="p-1.5 rounded-lg bg-muted"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{comment.text}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 input-field"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="btn-primary px-3"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
