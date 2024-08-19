import { QuestionSet, Question } from 'nest-commander';
import { ServerConfig } from '../../../config/config.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

@QuestionSet({ name: 'serverConfig' })
export class ConfigQuestions {
  @Question({
    type: 'input',
    name: 'name',
    message: 'Enter server name:',
    validate: (value: string) => ConfigQuestions.validateAnswer('name', value),
  })
  parseName(val: string): string {
    return val;
  }

  @Question({
    type: 'input',
    name: 'localDir',
    message: 'Enter local directory path:',
    validate: (value: string) =>
      ConfigQuestions.validateAnswer('localDir', value),
  })
  parseLocalDir(val: string): string {
    return val;
  }

  @Question({
    type: 'input',
    name: 'remoteDir',
    message: 'Enter remote directory path:',
    validate: (value: string) =>
      ConfigQuestions.validateAnswer('remoteDir', value),
  })
  parseRemoteDir(val: string): string {
    return val;
  }

  @Question({
    type: 'input',
    name: 'host',
    message: 'Enter server host:',
    validate: (value: string) => ConfigQuestions.validateAnswer('host', value),
  })
  parseHost(val: string): string {
    return val;
  }

  @Question({
    type: 'input',
    name: 'username',
    message: 'Enter SSH username:',
    validate: (value: string) =>
      ConfigQuestions.validateAnswer('username', value),
  })
  parseUsername(val: string): string {
    return val;
  }

  @Question({
    type: 'input',
    name: 'privateKey',
    message: 'Enter path to private key:',
    validate: (value: string) =>
      ConfigQuestions.validateAnswer('privateKey', value),
  })
  parsePrivateKey(val: string): string {
    return val;
  }

  private static validateAnswer<T = string>(key: keyof ServerConfig, value: T) {
    const partialConfig = plainToInstance(ServerConfig, { [key]: value });
    const errors: ValidationError[] = validateSync(partialConfig, {
      skipMissingProperties: true,
    });
    if (errors.length > 0) {
      const errorMessages = errors
        .flatMap((error) => Object.values(error.constraints || {}))
        .join(', ');
      return errorMessages;
    }
    return true;
  }
}
