"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var pino_1 = require("pino");
exports.logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || 'info',
    // Disable transport in Docker to avoid "unable to determine transportation" error
    /*
    transport: process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
      : undefined,
    */
});
