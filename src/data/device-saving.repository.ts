import { FactoryProvider, Injectable } from '@nestjs/common';
import { readCSV } from './import';
import type { DeviceSaving } from './entities/device-saving.entity';

@Injectable()
export class DeviceSavingRepository {
  private deviceSavingData: DeviceSaving[];
  constructor(data: DeviceSaving[]) {
    this.deviceSavingData = data;
  }

  getDeviceSaving(deviceId: number, from: Date, to: Date) {
    return this.deviceSavingData.filter(
      (val) =>
        val.device_id === deviceId &&
        from.valueOf() <= val.timestamp.valueOf() &&
        val.timestamp.valueOf() < to.valueOf(),
    );
  }
}

export const DeviceSavingRepositoryProvider: FactoryProvider<DeviceSavingRepository> =
  {
    provide: DeviceSavingRepository,
    useFactory: async () => {
      const data = await readCSV('./device-saving.csv', {
        timestamp: (item) => new Date(item),
      });
      console.log('finish importing device saving data');
      return new DeviceSavingRepository(data);
    },
  };
