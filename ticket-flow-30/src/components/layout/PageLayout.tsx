import { ReactNode } from 'react';
import Header from './Header';
import { UserRole } from '@/types/ticket';

interface PageLayoutProps {
  role: UserRole;
  title: string;
  children: ReactNode;
}

const PageLayout = ({ role, title, children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header role={role} title={title} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t bg-card py-3">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          Ticket Management System © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
