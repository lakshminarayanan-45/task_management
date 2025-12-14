import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Eye, EyeOff, LogIn, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
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
  const { login, currentUser } = useApp();
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6 shadow-lg shadow-primary/25 animate-float">
            <CheckSquare className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">TaskFlow</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Sign in to manage your tasks
            <Sparkles className="w-4 h-4 text-primary" />
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl animate-slide-up hover-glow" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <label className="block text-sm font-medium text-foreground mb-2">
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

            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-accent hover:border-primary/30 transition-all duration-300 group"
          >
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse-subtle" />
              Demo Credentials
            </span>
            <div className={`transition-transform duration-300 ${showCredentials ? "rotate-180" : ""}`}>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </button>

          <div className={`mt-2 bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 ${
            showCredentials ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}>
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => handleQuickLogin(cred)}
                className="w-full p-4 text-left hover:bg-accent transition-all duration-200 border-b border-border last:border-0 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cred.role}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cred.email}</p>
                  </div>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Click to use
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
