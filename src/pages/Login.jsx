import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login, currentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      </div>
    </div>
  );
}
