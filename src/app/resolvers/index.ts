import { MessageService } from "../services/messageService";
import { DiceService } from "../services/diceService";

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

const fakeDatabase: Record<string, { content: string; author: string }> = {};
const msgService = new MessageService(fakeDatabase);

// The root provides a resolver function for each API endpoint
const root = {
  hello,
  add,
  getDie: ({ numSides = 6 }: { numSides?: number }): DiceService => {
    return new DiceService(numSides);
  },
  ...msgService,
};

export { root };
