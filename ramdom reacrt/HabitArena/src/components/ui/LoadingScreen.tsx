import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default LoadingScreen;