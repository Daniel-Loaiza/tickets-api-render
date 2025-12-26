import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      requester_id: dto.requester_id,
      assignee_id: dto.assignee_id ?? null,
      topic: dto.topic,
      priority: dto.priority,
      description: dto.description,
      status: TicketStatus.Created,
    });

    return this.ticketsRepository.save(ticket);
  }

  async findAll(filters: FilterTicketsDto): Promise<Ticket[]> {
    const where: FindOptionsWhere<Ticket> = {};

    if (filters.status) where.status = filters.status;
    if (filters.requester_id !== undefined) {
      where.requester_id = filters.requester_id;
    }
    if (filters.assignee_id !== undefined) {
      where.assignee_id = filters.assignee_id;
    }

    return this.ticketsRepository.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (ticket.status === TicketStatus.Completed) {
      throw new BadRequestException('Completed tickets cannot change');
    }

    const nextStatus = dto.status ?? ticket.status;
    const nextAssignee =
      dto.assignee_id !== undefined ? dto.assignee_id : ticket.assignee_id;

    this.validateTransition(ticket.status, nextStatus, nextAssignee);

    ticket.assignee_id = nextAssignee ?? null;
    ticket.status = nextStatus;

    return this.ticketsRepository.save(ticket);
  }

  async finalize(id: number): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (ticket.status !== TicketStatus.InProgress) {
      throw new BadRequestException(
        'Finalization is only allowed from in_progress status',
      );
    }

    ticket.status = TicketStatus.Completed;
    return this.ticketsRepository.save(ticket);
  }

  private validateTransition(
    current: TicketStatus,
    next: TicketStatus,
    assignee: number | null,
  ) {
    if (current === next) {
      if (next === TicketStatus.InProgress && !assignee) {
        throw new BadRequestException(
          'Tickets in_progress must have an assignee',
        );
      }
      return;
    }

    if (current === TicketStatus.Created) {
      if (next !== TicketStatus.InProgress) {
        throw new BadRequestException(
          'Tickets must move to in_progress before completed',
        );
      }
      if (!assignee) {
        throw new BadRequestException(
          'An assignee is required to start progress on a ticket',
        );
      }
      return;
    }

    if (current === TicketStatus.InProgress) {
      if (next === TicketStatus.Completed) {
        return;
      }
      if (next === TicketStatus.InProgress) {
        if (!assignee) {
          throw new BadRequestException(
            'Tickets in_progress must have an assignee',
          );
        }
        return;
      }
    }

    throw new BadRequestException('Invalid status transition');
  }
}

