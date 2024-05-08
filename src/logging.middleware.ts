import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { ip, method, originalUrl, body } = req;
    const userAgent = req.get('user-agent') || '';

    const reqMsg = `${method} ${originalUrl} ${JSON.stringify(body)} - ${userAgent} ${ip}`;
    this.logger.log(reqMsg);

    res.on('close', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      const resMsg = `${method} ${originalUrl} ${userAgent} ${ip} \x1b[33m[STATUS] ${statusCode} +${duration}ms\x1b[0m`;
      if (statusCode < 400) {
        this.logger.log(resMsg);
      } else {
        this.logger.error(resMsg);
      }
    });

    next();
  }
}
