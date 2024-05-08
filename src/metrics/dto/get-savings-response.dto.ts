import { ApiProperty, PickType } from '@nestjs/swagger';
import { DeviceSaving } from '../../data/entities/device-saving.entity';

export class DeviceSavingPerDay extends PickType(DeviceSaving, [
  'timestamp',
  'carbon_saved',
  'fueld_saved',
]) {}

export class DeviceSavingMetric {
  /**
   * @example 200
   */
  total_carbon_saved: number;
  /**
   * @example 100
   */
  mean_carbon_saved: number;
  /**
   * @example 300
   */
  total_fueld_saved: number;
  /**
   * @example 150
   */
  mean_fueld_saved: number;

  @ApiProperty({
    example: [
      {
        timestamp: new Date('2023-01-01'),
        carbon_saved: 200,
        fueld_saved: 300,
      },
      {
        timestamp: new Date('2023-01-02'),
        carbon_saved: 100,
        fueld_saved: 150,
      },
    ],
  })
  saving_per_day: DeviceSavingPerDay[];
}
