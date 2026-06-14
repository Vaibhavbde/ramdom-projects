import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-elevated hover:shadow-elevated hover:scale-110 transition-all duration-300 bg-gradient-to-br from-primary to-primary-glow animate-float z-50"
    >
      <Plus className="h-6 w-6 md:h-8 md:w-8" />
    </Button>
  );
};
