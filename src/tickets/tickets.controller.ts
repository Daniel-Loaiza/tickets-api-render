import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './ticket.entity';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiCreatedResponse({ type: Ticket })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tickets with optional filters' })
  @ApiOkResponse({ type: Ticket, isArray: true })
  @ApiQuery({ name: 'status', required: false, enum: ['created', 'in_progress', 'completed'] })
  @ApiQuery({ name: 'requester_id', required: false, type: Number })
  @ApiQuery({ name: 'assignee_id', required: false, type: Number })
  findAll(@Query() filters: FilterTicketsDto): Promise<Ticket[]> {
    return this.ticketsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by id' })
  @ApiOkResponse({ type: Ticket })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Assign or change ticket status' })
  @ApiOkResponse({ type: Ticket })
  @ApiBadRequestResponse({ description: 'Invalid transition or validation error' })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, dto);
  }

  @Post(':id/finalizar')
  @ApiOperation({ summary: 'Finalize ticket (set to completed)' })
  @ApiOkResponse({ type: Ticket })
  @ApiBadRequestResponse({
    description: 'Finalization only allowed from in_progress',
  })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  finalize(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.ticketsService.finalize(id);
  }
}

