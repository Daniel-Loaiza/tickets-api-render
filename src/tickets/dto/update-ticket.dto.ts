import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TicketStatus } from '../ticket.entity';

export class UpdateTicketDto {
  @ApiPropertyOptional({ example: 7 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  assignee_id?: number;

  @ApiPropertyOptional({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
}

