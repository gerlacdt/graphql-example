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

export type MsgDatabase = Record<string, { content: string; author: string }>;

export interface MessageService {
  getAll(): Message[];
  getMessage({ id }: { id: string }): Message;
  createMessage({ input }: { input: MessageInput }): Message;
  updateMessage({ id, input }: { id: string; input: MessageInput }): Message;
}

export class MessageServiceImpl implements MessageService {
  constructor(public db: MsgDatabase) {}

  deleteAll(): void {
    this.db = {};
  }

  getAll(): Message[] {
    console.log("getAll()");
    const result: Message[] = [];
    for (const id in this.db) {
      result.push({ id, ...this.db[id] });
    }
    return result;
  }

  getMessage({ id }: { id: string }): Message {
    console.log("getMessage()");
    if (!this.db[id]) {
      throw new Error("no message exists with id " + id);
    }
    const { content, author } = this.db[id];
    return new Message(id, content, author);
  }

  createMessage({ input }: { input: MessageInput }): Message {
    console.log("createMessage()");
    // Create a random id for our "database".
    const id = require("crypto")
      .randomBytes(10)
      .toString("hex");

    this.db[id] = input;
    const { content, author } = this.db[id];

    const result = new Message(id, content, author);

    console.log("result: %j", result);
    return result;
  }

  updateMessage({ id, input }: { id: string; input: MessageInput }): Message {
    console.log("updateMessage()");
    if (!this.db[id]) {
      throw new Error("no message exists with id " + id);
    }
    // This replaces all old data, but some apps might want partial update.
    this.db[id] = input;
    const { content, author } = this.db[id];
    return new Message(id, content, author);
  }
}
