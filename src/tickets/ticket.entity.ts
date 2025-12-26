import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TicketStatus {
  Created = 'created',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum TicketTopic {
  Billing = 'billing',
  Bug = 'bug',
  Feature = 'feature',
  Other = 'other',
}

export enum TicketPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

@Entity()
export class Ticket {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'integer' })
  requester_id: number;

  @ApiProperty({ required: false, nullable: true })
  @Column({ type: 'integer', nullable: true })
  assignee_id: number | null;

  @ApiProperty({ enum: TicketTopic })
  @Column({ type: 'text' })
  topic: TicketTopic;

  @ApiProperty({ enum: TicketPriority })
  @Column({ type: 'text' })
  priority: TicketPriority;

  @ApiProperty({ enum: TicketStatus, default: TicketStatus.Created })
  @Column({ type: 'text', default: TicketStatus.Created })
  status: TicketStatus;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'datetime' })
  created_at: string;

  @ApiProperty()
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: string;
}

