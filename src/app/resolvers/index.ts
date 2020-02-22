import { Message, MessageInput } from "../services/messageService";
import { DiceService } from "../services/diceService";
import { Deps } from "../model";
import { createMessageResolver } from "./messageResolver";

interface AddResponse {
  result: number;
}

export function add({ a, b }: { a: number; b: number }): AddResponse {
  console.log("%d + %d", a, b);
  const result = a + b;
  return { result };
}

export function hello(): string {
  return "Hello world!";
}

export interface RootResolver {
  hello: () => string;
  add: ({ a, b }: { a: number; b: number }) => AddResponse;
  getDie: (input: { numSides?: number }) => DiceService;
  createMessage: ({ input }: { input: MessageInput }) => Message;
  updateMessage: ({
    id,
    input,
  }: {
    id: string;
    input: MessageInput;
  }) => Message;
  getAll: () => Message[];
  getMessage: ({ id }: { id: string }) => Message;
}

export function createRoot(deps: Deps): RootResolver {
  // The root provides a resolver function for each API endpoint
  const root = {
    hello,
    add,
    getDie: ({ numSides = 6 }: { numSides?: number }): DiceService => {
      return new DiceService(numSides);
    },
    ...createMessageResolver(deps.msgService),
  };
  return root;
}
