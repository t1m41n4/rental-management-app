type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private shouldLog: boolean;

  constructor() {
    this.shouldLog = process.env.NODE_ENV !== 'production';
  }

  log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage, data);
        break;
      case 'warn':
        console.warn(logMessage, data);
        break;
      default:
        console.log(logMessage, data);
    }
  }
}

export const logger = new Logger();
