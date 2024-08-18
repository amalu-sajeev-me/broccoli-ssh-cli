import * as chalk from 'chalk';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`;
  }

  log = (message: string): void => {
    console.log(chalk.white(this.formatMessage(message)));
  };

  info = (message: string): void => {
    console.log(chalk.blue(this.formatMessage(message)));
  };

  success = (message: string): void => {
    console.log(chalk.green(this.formatMessage(message)));
  };

  warn = (message: string): void => {
    console.log(chalk.yellow(this.formatMessage(message)));
  };

  error = (message: string): void => {
    console.log(chalk.red(this.formatMessage(message)));
  };

  debug = (message: string): void => {
    console.log(chalk.magenta(this.formatMessage(message)));
  };
}
