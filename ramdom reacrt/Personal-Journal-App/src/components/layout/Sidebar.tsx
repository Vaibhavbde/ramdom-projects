import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Settings, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'All Entries', href: '/entries', icon: BookOpen },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
            <PenLine className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              My Journal
            </h1>
            <p className="text-xs text-muted-foreground">Personal reflections</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-secondary/80 hover:scale-[1.02]',
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

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg">
          <p className="text-sm font-medium text-foreground mb-1">
            Keep writing!
          </p>
          <p className="text-xs text-muted-foreground">
            Express your thoughts daily for better mental clarity
          </p>
        </div>
      </div>
    </aside>
  );
};
