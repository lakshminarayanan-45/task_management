import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Mail, Phone, Building, ChevronRight, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/common/TaskCard";
import TaskModal from "../components/common/TaskModal";

const roleColors = {
  admin: "bg-primary/10 text-primary border-primary/20",
  manager: "bg-warning/10 text-warning border-warning/20",
  employee: "bg-info/10 text-info border-info/20",
};

export default function Team() {
  const { searchQuery } = useOutletContext();
  const { users, getTasksByAssignee } = useApp();
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team</h1>
        <p className="text-muted-foreground mt-1">
          View team members and their assignments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.map((user, index) => {
          const userTasks = getTasksByAssignee(user.id);
          const completedTasks = userTasks.filter((t) => t.status === "completed").length;
          
          return (
            <button
              key={user.id}
              onClick={() => setSelectedMember(user)}
              className="bg-card border border-border rounded-xl p-5 text-left hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-xl text-primary-foreground font-semibold shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 border ${roleColors[user.role]}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.department && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{user.department}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks</span>
                  <span className="font-medium text-foreground">{userTasks.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-success">{completedTasks}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No team members found</p>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          />
          
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Team Member Details</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl text-primary-foreground font-semibold">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedMember.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium mt-2 border ${roleColors[selectedMember.role]}`}>
                    {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="font-medium text-foreground">{selectedMember.email}</p>
                </div>
                
                {selectedMember.phone && (
                  <div className="p-4 rounded-lg bg-accent/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                    <p className="font-medium text-foreground">{selectedMember.phone}</p>
                  </div>
                )}
                
                {selectedMember.department && (
                  <div className="p-4 rounded-lg bg-accent/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Building className="w-4 h-4" />
                      Department
                    </div>
                    <p className="font-medium text-foreground">{selectedMember.department}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Assigned Tasks ({getTasksByAssignee(selectedMember.id).length})
                </h4>
                
                {getTasksByAssignee(selectedMember.id).length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {getTasksByAssignee(selectedMember.id).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        showAssignee={false}
                        onClick={() => {
                          setSelectedMember(null);
                          setSelectedTask(task);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No tasks assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
