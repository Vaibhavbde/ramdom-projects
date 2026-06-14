import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card = ({ children, className, onClick, hoverEffect = false }: CardProps) => {
  return (
    <div
      className={cn(
        'card',
        hoverEffect && 'hover:shadow-lg transform hover:-translate-y-1 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={cn('text-xl font-semibold', className)}>{children}</h3>;
};

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn('text-gray-600 dark:text-gray-400 mt-1', className)}>{children}</p>;
};

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>{children}</div>;
};

export default Card;