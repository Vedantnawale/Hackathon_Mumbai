import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword({ onPageChange }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl animate-fade-in">
      <button
        onClick={() => onPageChange('login')}
        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>

      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        Reset Password
      </h2>
      
      {!submitted ? (
        <>
          <p className="text-white/60 text-center mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 h-5 w-5 transition-colors group-hover:text-indigo-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-white/50 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Send Reset Link
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
          <p className="text-white/60 mb-6">
            We've sent password reset instructions to {email}
          </p>
          <button
            onClick={() => onPageChange('login')}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
}