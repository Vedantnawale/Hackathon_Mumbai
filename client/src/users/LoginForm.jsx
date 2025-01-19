import React, { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // For navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Login successful!", { position: "top-right" }); // Show toast message
        setTimeout(() => {
          navigate("/navbar"); // Navigate to the Navbar page after a short delay
        }, 1500);
      } else {
        toast.error(result.error || "Login failed", { position: "top-right" }); // Show error toast
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="w-full m-auto max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5 transition-colors group-hover:text-indigo-300" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-white/50 transition-all"
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5 transition-colors group-hover:text-indigo-300" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-white/50 transition-all"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-white/60">
        Don't have an account?
        <Link
          to="/create"
          className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
