import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from 'src/users/user.entity';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request & { user?: User }, res: Response, next: NextFunction) {
    const startTime = Date.now();

    const { method, originalUrl: url, params, query, body, headers, ip } = req;
    // const { ip, method, originalUrl } = req;
    const originalSend = res.send;
    res.send = function (responseBody) {
      const statusCode = res.statusCode;

      // 응답 전송
      res.send = originalSend;
      res.send(responseBody);
      const duration = Date.now() - startTime;

      const userInfo = req.user ? req.user.username : 'Anonymous';

      const logMessage = `${method} ${url} ${statusCode} ${ip} ${duration}ms ${userInfo}\n[REQUEST] Params: ${JSON.stringify(params)} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)} Headers: ${JSON.stringify(headers)}\n[RESPONSE] Status:${statusCode}\nBody: ${responseBody}`;

      if (statusCode >= 400 && statusCode < 500) this.logger.warn(logMessage);
      else if (statusCode >= 500) this.logger.error(logMessage);
      else
        this.logger.info(
          `${method} ${url} ${statusCode} ${ip} ${duration}ms ${userInfo}\n[REQUEST] Params: ${JSON.stringify(params)} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`,
        );
    }.bind(this);

    next();
  }
}
