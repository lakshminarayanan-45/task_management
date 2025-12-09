import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  Settings,
  LogOut,
  X,
  Layers,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/kanban", label: "Kanban Board", icon: Layers },
  { path: "/team", label: "Team", icon: Users },
  { path: "/calendar", label: "Calendar", icon: Calendar },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">TaskFlow</span>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-sidebar-accent">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {currentUser?.role || "Guest"}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full sidebar-item text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
