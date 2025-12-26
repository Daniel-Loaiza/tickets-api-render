import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOkResponse({
    description: 'Service health status',
    schema: {
      example: { ok: true },
    },
  })
  health() {
    return { ok: true };
  }
}
