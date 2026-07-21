import React, { useState } from 'react';
import Icon from './shared/Icon';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here.
    // For this demo, any login is successful.
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center">
            <Icon name="heart-pulse" className="w-16 h-16 mx-auto text-blue-600"/>
            <h1 className="mt-4 text-3xl font-bold text-gray-800">
                Health AI Diagnostics
            </h1>
            <p className="mt-2 text-gray-600">
                Welcome! Please sign in to continue.
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
