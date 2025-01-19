import React, { useState } from 'react';
import { Lock, Mail, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'react-toastify/dist/ReactToastify.css';

export default function CreateAccount({ onPageChange }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!', {
          onClose: () => onPageChange('login'), // Redirect to login after toast
        });
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 m-auto rounded-2xl backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl animate-fade-in">
      {/* Toast Container */}
      <ToastContainer />

      <button
        onClick={() => onPageChange('login')}
        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>

      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5 transition-colors group-hover:text-indigo-300" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Full Name"
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-white/50 transition-all"
            required
          />
        </div>

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

        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5 transition-colors group-hover:text-indigo-300" />
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirm Password"
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-white/50 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Account
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-white/60">
        Already have an account?
        <Link
          to="/login"
          className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
