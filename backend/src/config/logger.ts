import pino from 'pino';

const { stdTimeFunctions } = pino;

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const logger = (pino as unknown as (opts: any) => any)({
  level: LOG_LEVEL,
  base: { service: 'hackura-sentinel-backend', version: '1.0.0' },
  timestamp: stdTimeFunctions.isoTime,
});

export { logger };
export default logger;