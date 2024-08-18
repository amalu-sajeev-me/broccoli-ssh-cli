import { ChoicesFor, Question, QuestionSet } from 'nest-commander';
import { serverConfigs } from '../../../config';

@QuestionSet({
  name: 'shell',
})
export class ShellQuestions {
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
    return serverConfigs[serverIndex];
  }
  @ChoicesFor({
    name: 'server',
  })
  choices() {
    return serverConfigs.map((config, index) => {
      return { name: `${config.name} => ${config.host}`, value: index };
    });
  }
}
