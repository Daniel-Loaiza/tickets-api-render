import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, Wrench, Ticket } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'Full system access. View all tickets, assign solvers, manage topics, and finalize tickets.',
      icon: Shield,
      path: '/admin',
      color: 'bg-primary hover:bg-primary/90',
    },
    {
      id: 'creator',
      title: 'Creator',
      description: 'Create and track your tickets. View ticket status and filter by various criteria.',
      icon: User,
      path: '/creator',
      color: 'bg-accent hover:bg-accent/90',
    },
    {
      id: 'solver',
      title: 'Solver',
      description: 'View and manage assigned tickets. Update status and work on ticket resolution.',
      icon: Wrench,
      path: '/solver',
      color: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card py-6">
        <div className="container mx-auto px-4 flex items-center justify-center gap-3">
          <Ticket className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Ticket Management System</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Welcome to the Ticket Management System
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Efficiently manage support tickets, track issues, and collaborate with your team.
            Select your role below to get started.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-4 rounded-full bg-secondary inline-flex">
                  <role.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-sm min-h-[60px]">
                  {role.description}
                </CardDescription>
                <Button 
                  onClick={() => navigate(role.path)}
                  className={`w-full ${role.color} text-primary-foreground`}
                >
                  Continue as {role.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            API running at <code className="bg-muted px-2 py-1 rounded">http://localhost:3000</code>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Ticket Management System © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
