import { Ticket } from '@/types/ticket';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketTableProps {
  tickets: Ticket[];
  loading?: boolean;
  actions?: (ticket: Ticket) => React.ReactNode;
  emptyMessage?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'created':
      return 'bg-muted text-muted-foreground';
    case 'in_progress':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'completed':
      return 'bg-accent/10 text-accent border-accent/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-destructive font-medium';
    case 'medium':
      return 'text-warning font-medium';
    case 'low':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
};

const TicketTable = ({ tickets, loading, actions, emptyMessage = 'No tickets found' }: TicketTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading tickets...</span>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px] font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Requester</TableHead>
            <TableHead className="font-semibold">Assignee</TableHead>
            <TableHead className="font-semibold">Topic</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            {actions && <TableHead className="font-semibold text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-muted/30">
              <TableCell className="font-mono text-sm">#{ticket.id}</TableCell>
              <TableCell>{ticket.requester_id}</TableCell>
              <TableCell>
                {ticket.assignee_id || (
                  <span className="text-muted-foreground italic">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {ticket.topic}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={cn('capitalize', getPriorityColor(ticket.priority))}>
                  {ticket.priority}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={cn('capitalize', getStatusColor(ticket.status))}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              {actions && (
                <TableCell className="text-right">
                  {actions(ticket)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
