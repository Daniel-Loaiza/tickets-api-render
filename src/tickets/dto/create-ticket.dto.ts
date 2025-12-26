import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority, TicketTopic } from '../ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  requester_id: number;

  @ApiProperty({ example: 5, required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  assignee_id?: number;

  @ApiProperty({ enum: TicketTopic, example: TicketTopic.Bug })
  @IsEnum(TicketTopic)
  topic: TicketTopic;

  @ApiProperty({ enum: TicketPriority, example: TicketPriority.High })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @ApiProperty({ example: 'App crashes when saving' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

