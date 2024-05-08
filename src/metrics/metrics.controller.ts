import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { GetSavingsQueryDto } from './dto/get-savings-query.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeviceSavingMetric } from './dto/get-savings-response.dto';

@ApiTags('metricService')
@Controller('metricService')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('/v1/devices/:id')
  @ApiOkResponse({
    type: DeviceSavingMetric,
  })
  getDeviceSaving(
    @Query() query: GetSavingsQueryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    let { from, to } = query;
    const { durationAgo } = query;

    // additional validation
    // 1. one of 'from', 'to', 'durationAgo' must exist
    if (!from && !to && !durationAgo) {
      throw new BadRequestException(
        "one of 'from', 'to', 'durationAgo' must be defined",
      );
    }

    // 2. 'to' must be larger or equal to 'from'
    if (from && to) {
      if (to.valueOf() < from.valueOf()) {
        throw new BadRequestException("'to' must be larger or equal to 'from'");
      }
    }

    // if 'durationAgo' is defined, replace 'to' and 'from' values accordingly
    if (durationAgo) {
      to = new Date();
      from = this.metricsService.getStartDate(to, durationAgo);
    }

    // get metrics
    const result = this.metricsService.getDeviceSaving(id, from, to);

    return result;
  }
}
