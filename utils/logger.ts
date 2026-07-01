import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, service }) => {
      return `[${timestamp}] ${service} ${level}: ${message}`;
    })
  ),
  defaultMeta: {
    service: 'AT log -'
  }
});

export function printLog(output: string, logLevel = 'info') {
  switch (logLevel) {
  case 'debug':
    logger.debug(output);
    break;
  case 'info':
    logger.info(output);
    break;
  case 'warn':
    logger.warn(output);
    break;
  case 'error':
    logger.error(output);
    break;
  }
}
