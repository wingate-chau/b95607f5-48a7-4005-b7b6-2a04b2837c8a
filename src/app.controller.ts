import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

const healthCheckStatus = ['pass', 'fail'] as const;

type healthCheckStatusEnum = (typeof healthCheckStatus)[number];

class HealthCheckRes {
  @ApiProperty({
    enum: healthCheckStatus,
  })
  status: healthCheckStatusEnum;
}

@Controller()
export class AppController {
  constructor() {}

  @Get('healthCheck')
  @ApiOkResponse({
    type: HealthCheckRes,
  })
  getHello(): HealthCheckRes {
    const res = {
      status: 'pass' as const,
    };
    return res;
  }
}
