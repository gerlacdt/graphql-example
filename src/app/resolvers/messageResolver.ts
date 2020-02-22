import {
  MessageService,
  MessageInput,
  Message,
} from "../services/messageService";

interface MessageResolver {
  createMessage({ input }: { input: MessageInput }): Message;
  updateMessage({ id, input }: { id: string; input: MessageInput }): Message;
  getAll(): Message[];
  getMessage({ id }: { id: string }): Message;
}

export function createMessageResolver(
  msgService: MessageService,
): MessageResolver {
  const messageResolver = {
    createMessage: ({ input }: { input: MessageInput }): Message => {
      return msgService.createMessage({ input });
    },
    updateMessage: ({
      id,
      input,
    }: {
      id: string;
      input: MessageInput;
    }): Message => {
      return msgService.updateMessage({ id, input });
    },
    getAll: (): Message[] => {
      return msgService.getAll();
    },
    getMessage: ({ id }: { id: string }): Message => {
      return msgService.getMessage({ id });
    },
  };
  return messageResolver;
}
