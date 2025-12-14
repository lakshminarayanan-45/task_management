import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  Settings,
  LogOut,
  X,
  Layers,
  Sparkles,
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
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleOverlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={handleOverlayClick}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-out lg:translate-x-0 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <NavLink 
              to="/dashboard" 
              onClick={handleNavClick}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <CheckSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">TaskFlow</span>
            </NavLink>
            <button
              type="button"
              onClick={handleClose}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent active:bg-sidebar-accent/80 transition-all duration-200 hover:rotate-90"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`sidebar-item group animate-slide-in-left ${isActive ? "sidebar-item-active" : ""}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="transition-all duration-200">{item.label}</span>
                  {isActive && (
                    <Sparkles className="w-3 h-3 ml-auto text-primary animate-pulse" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-sidebar-accent/50 backdrop-blur-sm transition-all duration-300 hover:bg-sidebar-accent">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold animate-pulse-subtle">
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
              type="button"
              onClick={handleLogout}
              className="w-full sidebar-item text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
