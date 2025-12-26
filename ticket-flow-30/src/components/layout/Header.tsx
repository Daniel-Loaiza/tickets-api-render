import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/types/ticket';

interface HeaderProps {
  role: UserRole;
  title: string;
}

const roleColors: Record<UserRole, string> = {
  admin: 'bg-primary',
  creator: 'bg-accent',
  solver: 'bg-secondary',
};

const Header = ({ role, title }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Ticket className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Logged in as:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${roleColors[role]} text-primary-foreground`}
          >
            {role}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
