// Ticket types and interfaces

export type TicketStatus = 'created' | 'in_progress' | 'completed';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketTopic = 'billing' | 'bug' | 'feature' | 'other' | string;

export interface Ticket {
  id: number;
  requester_id: string;
  assignee_id: string | null;
  topic: TicketTopic;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTicketPayload {
  requester_id: string;
  topic: TicketTopic;
  priority: TicketPriority;
  description: string;
}

export interface UpdateTicketPayload {
  assignee_id?: string;
  status?: TicketStatus;
  topic?: TicketTopic;
  priority?: TicketPriority;
  description?: string;
}

export interface TicketFilters {
  status?: TicketStatus | '';
  requester_id?: string;
  assignee_id?: string;
  topic?: TicketTopic | '';
  priority?: TicketPriority | '';
}

export type UserRole = 'admin' | 'creator' | 'solver';
