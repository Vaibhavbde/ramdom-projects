import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      login(email, password);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] mx-auto mb-6">
            <span className="font-bold text-white text-3xl">L</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to LifeStack</h1>
          <p className="text-gray-400">The Ultimate Life Operating System.</p>
        </div>

        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-[50%] -translate-y-[50%] text-gray-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="saad@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-[50%] -translate-y-[50%] text-gray-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:hover:shadow-primary/30"
          >
            {loading ? "Authenticating..." : "Sign In to Dominance"}
            {!loading && <ArrowRight size={18} />}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Any credentials will log you into the demo right now.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
