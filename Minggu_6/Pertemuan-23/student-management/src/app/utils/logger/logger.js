import winston from "winston";
const LogstashTransport = require("winston-logstash/lib/winston-logstash-latest");

const logger = winston.createLogger({
    transports: [
        new LogstashTransport({
            port: 50000,
            node_name: "elasticsearch",
            host: "127.0.0.1",
        }),
    ]
});

export default logger;