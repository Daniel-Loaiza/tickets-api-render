// Ticket API service
import type { Ticket, CreateTicketPayload, UpdateTicketPayload, TicketFilters } from '@/types/ticket';

const API_BASE_URL = 'https://tickets-api-render.onrender.com/';

// Helper to build query string from filters
function buildQueryString(filters: TicketFilters): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.append(key, value);
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// Fetch all tickets with optional filters
export async function fetchTickets(filters: TicketFilters = {}): Promise<Ticket[]> {
  const queryString = buildQueryString(filters);
  const response = await fetch(`${API_BASE_URL}/tickets${queryString}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch a single ticket by ID
export async function fetchTicketById(id: number): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket: ${response.statusText}`);
  }
  
  return response.json();
}

// Create a new ticket
export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to create ticket');
  }
  
  return response.json();
}

// Update a ticket
export async function updateTicket(id: number, payload: UpdateTicketPayload): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to update ticket');
  }
  
  return response.json();
}

// Finalize a ticket
export async function finalizeTicket(id: number): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}/finalizar`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to finalize ticket');
  }
  
  return response.json();
}

// Check if API is available
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
