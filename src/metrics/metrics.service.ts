import { Injectable } from '@nestjs/common';
import { DeviceSavingRepository } from '../data/device-saving.repository';
import { DeviceSaving } from '../data/entities/device-saving.entity';
import * as moment from 'moment-timezone';
import {
  DeviceSavingMetric,
  DeviceSavingPerDay,
} from './dto/get-savings-response.dto';

@Injectable()
export class MetricsService {
  constructor(private deviceSavingRepository: DeviceSavingRepository) {}
  getDeviceSaving(deviceId: number, from: Date, to: Date): DeviceSavingMetric {
    // get device saving with date range and device id
    const data = this.deviceSavingRepository.getDeviceSaving(
      deviceId,
      from,
      to,
    );

    const carbonTotal = this.getDeviceSavingTotal(data, 'carbon_saved');
    const fueldTotal = this.getDeviceSavingTotal(data, 'fueld_saved');

    const deltaMonth = this.getDeltaMonths(from, to);

    const CMeanPerMonth = this.getAverage(carbonTotal, deltaMonth);
    const FDMeanPerMonth = this.getAverage(fueldTotal, deltaMonth);

    const savingPerDay = this.getDeviceSavingPerDay(data);

    return {
      total_carbon_saved: carbonTotal,
      mean_carbon_saved: CMeanPerMonth,
      total_fueld_saved: fueldTotal,
      mean_fueld_saved: FDMeanPerMonth,
      saving_per_day: savingPerDay,
    };
  }

  getDeviceSavingPerDay(data: DeviceSaving[]): DeviceSavingPerDay[] {
    let left = 0;
    const final: DeviceSavingPerDay[] = [];
    while (left < data.length) {
      const day = data[left].timestamp.getDay();
      let right = left;
      let carbon = 0;
      let fueld = 0;
      while (right < data.length && data[right].timestamp.getDay() === day) {
        carbon += data[right].carbon_saved;
        fueld += data[right].fueld_saved;
        right++;
      }

      final.push({
        timestamp: data[left].timestamp,
        carbon_saved: carbon,
        fueld_saved: fueld,
      });
      left = right;
    }
    return final;
  }

  getDeviceSavingTotal(
    data: DeviceSaving[],
    fieldName: 'carbon_saved' | 'fueld_saved',
  ) {
    return data.reduce((prev, curr) => prev + curr[fieldName], 0);
  }

  getDeltaMonths(from: Date, to: Date) {
    return moment(to).diff(moment(from), 'months', true);
  }

  getAverage(total: number, duration: number) {
    return total / duration;
  }

  getStartDate(to: Date, durationAgo: string) {
    const [numStr, unitStr] = durationAgo.split('|');

    const num = parseInt(numStr);
    const unit = unitStr === 'd' ? 'days' : 'years';

    return moment(to).subtract(num, unit).toDate();
  }
}
