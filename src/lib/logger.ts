import winston from "winston";
const { createLogger, format } = winston;
const { combine, timestamp, prettyPrint } = format;
const logger = createLogger({
  level: "info",
  format: combine(winston.format.colorize(), timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [
    // new winston.transports.File({
    //   filename: 'combined.log',
    //   level: 'info',
    // }),
    new winston.transports.File({
      filename: "./log/error.log",
      level: "error"
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export default logger;

// logger.error('我是error');
// logger.info('1111',{message:'world',service:'main'})
