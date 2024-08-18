import { ChoicesFor, Question, QuestionSet } from 'nest-commander';
import { EnvProvider } from '../../../providers/env.provider';

@QuestionSet({
  name: 'shell',
})
export class ShellQuestions {
  constructor(private readonly _envProvider: EnvProvider) {}
  //   @Question({
  //     type: 'confirm',
  //     name: 'message',
  //     message: 'What does the cow say?',
  //   })
  //   parseMessage(value: string) {
  //     console.log({ value });
  //     return value;
  //   }
  @Question({
    type: 'list',
    name: 'server',
    message: 'choose your server to connect',
  })
  chooseServer(serverIndex: number) {
    const serverConfigs = this._envProvider.getServerConfigs();
    return serverConfigs[serverIndex];
  }
  @ChoicesFor({
    name: 'server',
  })
  choices() {
    const serverConfigs = this._envProvider.getServerConfigs();
    return serverConfigs.map((config, index) => {
      return { name: `${config.name} => ${config.host}`, value: index };
    });
  }
}
