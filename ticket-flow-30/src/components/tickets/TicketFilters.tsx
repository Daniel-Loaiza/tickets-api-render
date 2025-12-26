import { TicketFilters as TicketFiltersType, TicketStatus, TicketPriority } from '@/types/ticket';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TicketFiltersProps {
  filters: TicketFiltersType;
  onFilterChange: (filters: TicketFiltersType) => void;
  showRequesterId?: boolean;
  showAssigneeId?: boolean;
  topics?: string[];
}

const DEFAULT_TOPICS = ['billing', 'bug', 'feature', 'other'];
const STATUSES: TicketStatus[] = ['created', 'in_progress', 'completed'];
const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high'];

const TicketFilters = ({
  filters,
  onFilterChange,
  showRequesterId = true,
  showAssigneeId = true,
  topics = DEFAULT_TOPICS,
}: TicketFiltersProps) => {
  const handleChange = (key: keyof TicketFiltersType, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      requester_id: '',
      assignee_id: '',
      topic: '',
      priority: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v.trim() !== '');

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {showRequesterId && (
          <div className="space-y-1.5">
            <Label htmlFor="requester_id" className="text-xs">
              Requester ID
            </Label>
            <Input
              id="requester_id"
              placeholder="Enter requester ID"
              value={filters.requester_id || ''}
              onChange={(e) => handleChange('requester_id', e.target.value)}
              className="h-9"
            />
          </div>
        )}

        {showAssigneeId && (
          <div className="space-y-1.5">
            <Label htmlFor="assignee_id" className="text-xs">
              Assignee ID
            </Label>
            <Input
              id="assignee_id"
              placeholder="Enter assignee ID"
              value={filters.assignee_id || ''}
              onChange={(e) => handleChange('assignee_id', e.target.value)}
              className="h-9"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="topic" className="text-xs">
            Topic
          </Label>
          <Select
            value={filters.topic || 'all'}
            onValueChange={(value) => handleChange('topic', value === 'all' ? '' : value)}
          >
            <SelectTrigger id="topic" className="h-9">
              <SelectValue placeholder="All topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic} className="capitalize">
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priority" className="text-xs">
            Priority
          </Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) => handleChange('priority', value === 'all' ? '' : value)}
          >
            <SelectTrigger id="priority" className="h-9">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority} className="capitalize">
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs">
            Status
          </Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleChange('status', value === 'all' ? '' : value)}
          >
            <SelectTrigger id="status" className="h-9">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;
