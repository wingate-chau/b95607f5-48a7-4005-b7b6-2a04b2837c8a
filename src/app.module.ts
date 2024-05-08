import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MetricsModule } from './metrics/metrics.module';
import { LoggerMiddleware } from './logging.middleware';

@Module({
  imports: [MetricsModule],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
