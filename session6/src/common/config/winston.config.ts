import * as fs from 'fs';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const cwd = process.cwd();
const logDir = `${cwd}/logs`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const dailyOption = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: `${cwd}/logs`,
    filename: `%DATE%.${level}.log`,
    maxFiles: '10d',
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(process.env.NODE_ENV, {
        colors: false,
        prettyPrint: true,
      }),
    ),
  };
};

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: 'http',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV, {
          colors: true,
          prettyPrint: true,
        }),
        winston.format.colorize(),
      ),
    }),
    new winstonDaily(dailyOption('info')),
    new winstonDaily(dailyOption('warn')),
    new winstonDaily(dailyOption('error')),
  ],
};

// logger 인스턴스 생성
export const winstonLogger = WinstonModule.createLogger(winstonConfig);
