import { useState, useEffect, useCallback } from 'react';
import { Ticket, TicketFilters as TicketFiltersType } from '@/types/ticket';
import { fetchTickets } from '@/services/ticketApi';
import PageLayout from '@/components/layout/PageLayout';
import TicketTable from '@/components/tickets/TicketTable';
import TicketFilters from '@/components/tickets/TicketFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertTriangle, Search, User } from 'lucide-react';

const CreatorPanel = () => {
  const [requesterId, setRequesterId] = useState('');
  const [activeRequesterId, setActiveRequesterId] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFiltersType>({});

  const loadTickets = useCallback(async () => {
    if (!activeRequesterId.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTickets({
        ...filters,
        requester_id: activeRequesterId,
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
  }, [activeRequesterId, filters]);

  useEffect(() => {
    if (activeRequesterId) {
      loadTickets();
    }
  }, [loadTickets, activeRequesterId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (requesterId.trim()) {
      setActiveRequesterId(requesterId.trim());
    }
  };

  const handleFilterChange = (newFilters: TicketFiltersType) => {
    // Remove requester_id from filters since we control it separately
    const { requester_id, ...rest } = newFilters;
    setFilters(rest);
  };

  return (
    <PageLayout role="creator" title="Creator Panel">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Tickets</h2>
          <p className="text-sm text-muted-foreground">
            View and track tickets you have created
          </p>
        </div>

        {/* Search Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Enter Your Requester ID
            </CardTitle>
            <CardDescription>
              Enter your ID to view tickets you have created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="requester_id" className="sr-only">
                  Requester ID
                </Label>
                <Input
                  id="requester_id"
                  placeholder="Enter your requester ID (e.g., user123)"
                  value={requesterId}
                  onChange={(e) => setRequesterId(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={!requesterId.trim()}>
                <Search className="h-4 w-4 mr-2" />
                View Tickets
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Show content only after searching */}
        {activeRequesterId && (
          <>
            {/* Active User Display */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Viewing tickets for: <span className="font-medium text-foreground">{activeRequesterId}</span>
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

            {/* Filters - without requester_id */}
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
              emptyMessage={`No tickets found for requester "${activeRequesterId}". Check your ID or contact an admin.`}
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
        {!activeRequesterId && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Enter your Requester ID above to view your tickets</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CreatorPanel;
