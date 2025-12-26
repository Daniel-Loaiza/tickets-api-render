import { useState, useEffect, useCallback } from 'react';
import { Ticket, TicketFilters as TicketFiltersType, CreateTicketPayload } from '@/types/ticket';
import { fetchTickets, createTicket, updateTicket, finalizeTicket } from '@/services/ticketApi';
import PageLayout from '@/components/layout/PageLayout';
import TicketTable from '@/components/tickets/TicketTable';
import TicketFilters from '@/components/tickets/TicketFilters';
import CreateTicketModal from '@/components/tickets/CreateTicketModal';
import AssignTicketModal from '@/components/tickets/AssignTicketModal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Plus, RefreshCw, AlertTriangle, Play, CheckCircle, Flag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_TOPICS = ['billing', 'bug', 'feature', 'other'];

const AdminPanel = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTickets(filters);
      setTickets(data);
      // Extract unique topics from tickets
      const uniqueTopics = new Set([
        ...DEFAULT_TOPICS,
        ...data.map((t) => t.topic),
      ]);
      setTopics(Array.from(uniqueTopics));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch tickets. Ensure the API is running at http://localhost:3000'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCreateTicket = async (payload: CreateTicketPayload) => {
    setActionLoading(true);
    try {
      await createTicket(payload);
      toast({
        title: 'Ticket Created',
        description: 'The ticket has been created successfully.',
      });
      loadTickets();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create ticket',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTicket = async (ticketId: number, assigneeId: string) => {
    setActionLoading(true);
    try {
      await updateTicket(ticketId, { assignee_id: assigneeId });
      toast({
        title: 'Ticket Assigned',
        description: `Ticket #${ticketId} assigned to ${assigneeId}`,
      });
      loadTickets();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to assign ticket',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoveToInProgress = async (ticket: Ticket) => {
    if (!ticket.assignee_id) {
      toast({
        title: 'Cannot Move',
        description: 'Ticket must have an assignee before moving to in_progress',
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
        description: 'Ticket must be in_progress before completing',
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

  const handleFinalize = async (ticket: Ticket) => {
    if (ticket.status !== 'in_progress') {
      toast({
        title: 'Cannot Finalize',
        description: 'Ticket must be in_progress before finalizing',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    try {
      await finalizeTicket(ticket.id);
      toast({
        title: 'Ticket Finalized',
        description: `Ticket #${ticket.id} has been finalized`,
      });
      loadTickets();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to finalize ticket',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAssignModalOpen(true);
  };

  const renderActions = (ticket: Ticket) => {
    const canAssign = ticket.status !== 'completed';
    const canMoveToProgress = ticket.status === 'created' && ticket.assignee_id;
    const canComplete = ticket.status === 'in_progress';
    const canFinalize = ticket.status === 'in_progress';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={actionLoading}>
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canAssign && (
            <DropdownMenuItem onClick={() => openAssignModal(ticket)}>
              <Play className="h-4 w-4 mr-2" />
              {ticket.assignee_id ? 'Reassign' : 'Assign Solver'}
            </DropdownMenuItem>
          )}
          {ticket.status === 'created' && (
            <DropdownMenuItem
              onClick={() => handleMoveToInProgress(ticket)}
              disabled={!canMoveToProgress}
              className={!canMoveToProgress ? 'opacity-50' : ''}
            >
              <Play className="h-4 w-4 mr-2" />
              Move to In Progress
              {!ticket.assignee_id && (
                <span className="ml-1 text-xs text-muted-foreground">(needs assignee)</span>
              )}
            </DropdownMenuItem>
          )}
          {canComplete && (
            <DropdownMenuItem onClick={() => handleComplete(ticket)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Completed
            </DropdownMenuItem>
          )}
          {canFinalize && (
            <DropdownMenuItem onClick={() => handleFinalize(ticket)}>
              <Flag className="h-4 w-4 mr-2" />
              Finalize
            </DropdownMenuItem>
          )}
          {ticket.status === 'completed' && (
            <DropdownMenuItem disabled className="opacity-50">
              No actions available
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <PageLayout role="admin" title="Admin Panel">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Tickets</h2>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all tickets in the system
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTickets} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <TicketFilters
          filters={filters}
          onFilterChange={setFilters}
          topics={topics}
        />

        {/* Tickets Table */}
        <TicketTable
          tickets={tickets}
          loading={loading}
          actions={renderActions}
          emptyMessage="No tickets found. Try adjusting your filters or create a new ticket."
        />

        {/* Stats */}
        {!loading && tickets.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTicketModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateTicket}
        topics={topics}
        loading={actionLoading}
      />
      <AssignTicketModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        ticket={selectedTicket}
        onSubmit={handleAssignTicket}
        loading={actionLoading}
      />
    </PageLayout>
  );
};

export default AdminPanel;
