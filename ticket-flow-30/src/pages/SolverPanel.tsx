import { useState, useEffect, useCallback } from 'react';
import { Ticket, TicketFilters as TicketFiltersType } from '@/types/ticket';
import { fetchTickets, updateTicket } from '@/services/ticketApi';
import PageLayout from '@/components/layout/PageLayout';
import TicketTable from '@/components/tickets/TicketTable';
import TicketFilters from '@/components/tickets/TicketFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, AlertTriangle, Search, Wrench, Play, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SolverPanel = () => {
  const [assigneeId, setAssigneeId] = useState('');
  const [activeAssigneeId, setActiveAssigneeId] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const loadTickets = useCallback(async () => {
    if (!activeAssigneeId.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTickets({
        ...filters,
        assignee_id: activeAssigneeId,
      });
      setTickets(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch tickets. Ensure the API is running at http://localhost:3000'
      );
    } finally {
      setLoading(false);
    }
  }, [activeAssigneeId, filters]);

  useEffect(() => {
    if (activeAssigneeId) {
      loadTickets();
    }
  }, [loadTickets, activeAssigneeId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigneeId.trim()) {
      setActiveAssigneeId(assigneeId.trim());
    }
  };

  const handleFilterChange = (newFilters: TicketFiltersType) => {
    // Remove assignee_id from filters since we control it separately
    const { assignee_id, ...rest } = newFilters;
    setFilters(rest);
  };

  const handleMoveToInProgress = async (ticket: Ticket) => {
    if (ticket.status !== 'created') {
      toast({
        title: 'Cannot Move',
        description: 'Only created tickets can be moved to in_progress',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    try {
      await updateTicket(ticket.id, { status: 'in_progress' });
      toast({
        title: 'Status Updated',
        description: `Ticket #${ticket.id} is now in progress`,
      });
      loadTickets();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update ticket',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (ticket: Ticket) => {
    if (ticket.status !== 'in_progress') {
      toast({
        title: 'Cannot Complete',
        description: 'Only in_progress tickets can be completed',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    try {
      await updateTicket(ticket.id, { status: 'completed' });
      toast({
        title: 'Ticket Completed',
        description: `Ticket #${ticket.id} has been completed`,
      });
      loadTickets();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to complete ticket',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const renderActions = (ticket: Ticket) => {
    const canMoveToProgress = ticket.status === 'created';
    const canComplete = ticket.status === 'in_progress';

    if (ticket.status === 'completed') {
      return (
        <span className="text-xs text-muted-foreground italic">Completed</span>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={actionLoading}>
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canMoveToProgress && (
            <DropdownMenuItem onClick={() => handleMoveToInProgress(ticket)}>
              <Play className="h-4 w-4 mr-2" />
              Start Working
            </DropdownMenuItem>
          )}
          {canComplete && (
            <DropdownMenuItem onClick={() => handleComplete(ticket)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Completed
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <PageLayout role="solver" title="Solver Panel">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assigned Tickets</h2>
          <p className="text-sm text-muted-foreground">
            View and work on tickets assigned to you
          </p>
        </div>

        {/* Search Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Enter Your Solver ID
            </CardTitle>
            <CardDescription>
              Enter your ID to view tickets assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="assignee_id" className="sr-only">
                  Assignee ID
                </Label>
                <Input
                  id="assignee_id"
                  placeholder="Enter your solver ID (e.g., solver001)"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={!assigneeId.trim()}>
                <Search className="h-4 w-4 mr-2" />
                View Tickets
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Show content only after searching */}
        {activeAssigneeId && (
          <>
            {/* Active User Display */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Viewing tickets for: <span className="font-medium text-foreground">{activeAssigneeId}</span>
              </div>
              <Button variant="outline" size="sm" onClick={loadTickets} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Filters - without assignee_id */}
            <TicketFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              showRequesterId={false}
              showAssigneeId={false}
            />

            {/* Tickets Table */}
            <TicketTable
              tickets={tickets}
              loading={loading}
              actions={renderActions}
              emptyMessage={`No tickets assigned to "${activeAssigneeId}". Check your ID or wait for ticket assignments.`}
            />

            {/* Stats */}
            {!loading && tickets.length > 0 && (
              <div className="text-sm text-muted-foreground text-right">
                Found {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!activeAssigneeId && (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Enter your Solver ID above to view assigned tickets</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SolverPanel;
