interface FooResponse {
  result: number;
}

export function foo({ id }: { id: string }): FooResponse {
  const table: { [key: string]: number } = { a: 42, b: 100 };
  const result = table[id];
  if (!result) {
    return { result: 666 };
  }
  return { result };
}

export function hello(): string {
  return "Hello world!";
}

export class Message {
  constructor(
    public id: string,
    public content: string,
    public author: string,
  ) {}
}

export class MessageInput {
  constructor(public content: string, public author: string) {}
}

const fakeDatabase: Record<string, { content: string; author: string }> = {};

export class RandomDie {
  constructor(public numSides: number) {}

  public rollOnce(): number {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  public roll({ numRolls }: { numRolls: number }): number[] {
    const output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides a resolver function for each API endpoint
const root = {
  hello,
  foo,
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: ({
    numDice,
    numSides = 6,
  }: {
    numDice: number;
    numSides?: number;
  }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * numSides));
    }
    return output;
  },
  getDie: ({ numSides = 6 }: { numSides?: number }) => {
    return new RandomDie(numSides);
  },

  getMessage: ({ id }: { id: string }) => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    const { content, author } = fakeDatabase[id];
    return new Message(id, content, author);
  },
  createMessage: ({ input }: { input: MessageInput }) => {
    // Create a random id for our "database".
    var id = require("crypto")
      .randomBytes(10)
      .toString("hex");

    fakeDatabase[id] = input;
    const { content, author } = fakeDatabase[id];
    return new Message(id, content, author);
  },
  updateMessage: ({ id, input }: { id: string; input: MessageInput }) => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    const { content, author } = fakeDatabase[id];
    return new Message(id, content, author);
  },
};

export { root, fakeDatabase };
