import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import {
  DeviceSavingRepository,
  DeviceSavingRepositoryProvider,
} from '../data/device-saving.repository';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, DeviceSavingRepositoryProvider],
  exports: [DeviceSavingRepository],
})
export class MetricsModule {}
