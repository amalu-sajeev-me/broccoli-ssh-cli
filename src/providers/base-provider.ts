import { Logger } from '../utils/logger';

export abstract class BaseProvider {
  protected readonly logger: Logger;

  constructor(private readonly context: string) {
    this.logger = new Logger(context);
  }
}
