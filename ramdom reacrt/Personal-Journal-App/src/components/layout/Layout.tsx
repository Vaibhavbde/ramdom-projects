import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {isMobile ? (
        <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
      ) : (
        <Sidebar />
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
