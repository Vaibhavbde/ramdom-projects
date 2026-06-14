import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../../components/ui/ThemeToggle';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      await resetPassword(email);
      setMessage('Password reset link sent to your email!');
    } catch (err) {
      setError('Failed to send reset link. Please check your email and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <span className="text-primary-500 font-bold text-3xl">Habit</span>
            <span className="text-gray-700 dark:text-gray-300 font-bold text-3xl">Arena</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We'll send you a link to reset your password
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                {error}
              </div>
            )}
            
            {message && (
              <div className="mb-4 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                {message}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  size="lg"
                >
                  Send reset link
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
                Back to sign in
              </Link>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    For demo purposes
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  This is a demo app, the reset email won't actually be sent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;