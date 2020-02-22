import { MessageService } from "../services/messageService";
import { DiceService } from "../services/diceService";
import { Deps } from "../model";

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
  messages: MessageService;
}

export function createRoot(deps: Deps): RootResolver {
  // The root provides a resolver function for each API endpoint
  const root = {
    hello,
    add,
    getDie: ({ numSides = 6 }: { numSides?: number }): DiceService => {
      return new DiceService(numSides);
    },
    messages: deps.msgService,
  };
  return root;
}
