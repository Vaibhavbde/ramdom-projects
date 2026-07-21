import React, { useState } from 'react';
import Icon from './shared/Icon';

interface AuthProps {
  onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username.trim() || !password.trim()) {
        setError('Username and password cannot be empty.');
        return;
    }
    const users = JSON.parse(localStorage.getItem('medixplain_users') || '[]');
    if (users.find((user: any) => user.username === username)) {
      setError('Username already exists. Please choose another one.');
      return;
    }
    users.push({ username, password });
    localStorage.setItem('medixplain_users', JSON.stringify(users));
    setSuccess('Account created successfully! Please log in.');
    setIsLoginView(true);
    setUsername('');
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const users = JSON.parse(localStorage.getItem('medixplain_users') || '[]');
    const user = users.find((user: any) => user.username === username);
    if (user && user.password === password) {
      onLogin(username);
    } else {
      setError('Invalid username or password.');
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center">
            <Icon name="heart-pulse" className="w-16 h-16 mx-auto text-blue-600"/>
            <h1 className="mt-4 text-3xl font-bold text-gray-800">
                Welcome to MediXplain
            </h1>
            <p className="mt-2 text-gray-600">
                {isLoginView ? 'Please sign in to continue.' : 'Create your account.'}
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isLoginView ? handleLogin : handleSignUp}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
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
              <label htmlFor="password" className="sr-only">Password</label>
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

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-500 text-center">{success}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="text-center">
            <button onClick={toggleView} className="text-sm text-blue-600 hover:underline">
                {isLoginView ? "Don't have an account? Create one" : "Already have an account? Sign In"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
