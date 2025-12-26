import { useState } from 'react';
import { CreateTicketPayload, TicketPriority } from '@/types/ticket';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateTicketPayload) => Promise<void>;
  topics?: string[];
  loading?: boolean;
}

const DEFAULT_TOPICS = ['billing', 'bug', 'feature', 'other'];
const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high'];

const CreateTicketModal = ({
  open,
  onOpenChange,
  onSubmit,
  topics = DEFAULT_TOPICS,
  loading = false,
}: CreateTicketModalProps) => {
  const [formData, setFormData] = useState<CreateTicketPayload>({
    requester_id: '',
    topic: 'other',
    priority: 'medium',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.requester_id.trim()) {
      newErrors.requester_id = 'Requester ID is required';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    if (!formData.priority.trim()) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        requester_id: '',
        topic: 'other',
        priority: 'medium',
        description: '',
      });
      setErrors({});
      onOpenChange(false);
    } catch {
      // Error handled by parent
    }
  };

  const handleChange = (field: keyof CreateTicketPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new support ticket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requester_id">
              Requester ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="requester_id"
              placeholder="Enter your ID (e.g., user123)"
              value={formData.requester_id}
              onChange={(e) => handleChange('requester_id', e.target.value)}
              className={errors.requester_id ? 'border-destructive' : ''}
            />
            {errors.requester_id && (
              <p className="text-xs text-destructive">{errors.requester_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">
                Topic <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.topic}
                onValueChange={(value) => handleChange('topic', value)}
              >
                <SelectTrigger id="topic" className={errors.topic ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic} className="capitalize">
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.topic && (
                <p className="text-xs text-destructive">{errors.topic}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value as TicketPriority)}
              >
                <SelectTrigger id="priority" className={errors.priority ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority} className="capitalize">
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-xs text-destructive">{errors.priority}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your issue in detail..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
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
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
