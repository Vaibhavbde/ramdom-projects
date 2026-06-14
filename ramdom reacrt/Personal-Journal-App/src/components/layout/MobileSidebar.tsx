import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Settings, PenLine, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'All Entries', href: '/entries', icon: BookOpen },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebar = ({ open, onOpenChange }: MobileSidebarProps) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
            <PenLine className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              My Journal
            </h1>
          </div>
        </div>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex-1 mt-6 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'}
                  onClick={() => onOpenChange(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      'hover:bg-secondary/80',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-foreground'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn('h-5 w-5', isActive && 'animate-scale-in')} />
                      <span className="font-medium">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto pt-6">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">
                  Keep writing!
                </p>
                <p className="text-xs text-muted-foreground">
                  Express your thoughts daily for better mental clarity
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="h-16" /> {/* Spacer for fixed header */}
    </>
  );
};
