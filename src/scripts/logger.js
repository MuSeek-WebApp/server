import appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';

// Custom Format
const customFormat = format.printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message} `;
});

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: 'server.log',
    dirname: `${appRoot}/logs`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  },
  console: {
    level: 'debug',
    handleExceptions: true
  }
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss'
    }),
    customFormat
  ),
  transports: [new transports.File(options.file)]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(options.console));
}

// create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
  write: (message) => {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

export default logger;
