import { useState } from 'react';
import { Ticket } from '@/types/ticket';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AssignTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onSubmit: (ticketId: number, assigneeId: string) => Promise<void>;
  loading?: boolean;
}

const AssignTicketModal = ({
  open,
  onOpenChange,
  ticket,
  onSubmit,
  loading = false,
}: AssignTicketModalProps) => {
  const [assigneeId, setAssigneeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigneeId.trim()) {
      setError('Assignee ID is required');
      return;
    }

    if (!ticket) return;

    try {
      await onSubmit(ticket.id, assigneeId.trim());
      setAssigneeId('');
      setError('');
      onOpenChange(false);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Ticket #{ticket?.id}</DialogTitle>
          <DialogDescription>
            Enter the solver's ID to assign this ticket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignee_id">
              Solver ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assignee_id"
              placeholder="Enter solver ID (e.g., solver001)"
              value={assigneeId}
              onChange={(e) => {
                setAssigneeId(e.target.value);
                setError('');
              }}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTicketModal;
