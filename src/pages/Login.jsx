import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Eye, EyeOff, LogIn, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

const demoCredentials = [
  { role: "Admin", email: "admin@taskflow.com", password: "admin123" },
  { role: "Manager", email: "sarah@taskflow.com", password: "sarah123" },
  { role: "Employee 1", email: "john@taskflow.com", password: "john123" },
  { role: "Employee 2", email: "emily@taskflow.com", password: "emily123" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, currentUser, theme } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = login(email, password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    }, 500);
  };

  const handleQuickLogin = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <CheckSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your tasks</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-accent transition-colors"
          >
            <span className="text-sm font-medium text-foreground">Demo Credentials</span>
            {showCredentials ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showCredentials && (
            <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(cred)}
                  className="w-full p-4 text-left hover:bg-accent transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{cred.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cred.email}</p>
                    </div>
                    <span className="text-xs text-primary">Click to use</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
