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

type MsgDatabase = Record<string, { content: string; author: string }>;

// const fakeDatabase: Record<string, { content: string; author: string }> = {};

export class MessageService {
  constructor(public db: MsgDatabase) {}

  getMessage({ id }: { id: string }): Message {
    if (!this.db[id]) {
      throw new Error("no message exists with id " + id);
    }
    const { content, author } = this.db[id];
    return new Message(id, content, author);
  }

  createMessage({ input }: { input: MessageInput }): Message {
    // Create a random id for our "database".
    const id = require("crypto")
      .randomBytes(10)
      .toString("hex");

    this.db[id] = input;
    const { content, author } = this.db[id];
    return new Message(id, content, author);
  }

  updateMessage({ id, input }: { id: string; input: MessageInput }): Message {
    if (!this.db[id]) {
      throw new Error("no message exists with id " + id);
    }
    // This replaces all old data, but some apps might want partial update.
    this.db[id] = input;
    const { content, author } = this.db[id];
    return new Message(id, content, author);
  }
}
