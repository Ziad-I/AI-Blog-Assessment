import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, json, colorize, simple } = winston.format;

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
  silly: "cyan",
};

winston.addColors(logColors);

const fileRotateTransport = new DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "1d",
  maxSize: "20m",
});

const logger = winston.createLogger({
  level: "silly",
  format: json(),
  transports: [
    fileRotateTransport,
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), simple()),
    })
  );
}

export default logger;
