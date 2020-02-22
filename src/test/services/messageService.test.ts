import { MessageServiceImpl } from "../../app/services/messageService";

describe("MessageService", () => {
  test("insert message", () => {
    const svc = new MessageServiceImpl({});

    const input = { author: "foobar-author", content: "content" };
    const msg = svc.createMessage({
      input,
    });

    expect(msg.id).toBeDefined();
    const { id, ...actual } = msg; // eslint-disable-line
    expect(actual).toEqual(input);
  });

  test("get all message", () => {
    // create 2 messages
    const svc = new MessageServiceImpl({});
    const input = { author: "foobar-author", content: "content" };
    svc.createMessage({
      input,
    });
    svc.createMessage({
      input: { author: "author2", content: "content2" },
    });

    // get all messages
    const actual = svc.getAll();
    expect(actual.length).toEqual(2);
  });

  test("get message by id", () => {
    const svc = new MessageServiceImpl({});
    const input = { author: "foobar-author", content: "content" };
    const msg = svc.createMessage({
      input,
    });
    const actual = svc.getMessage({ id: msg.id });
    expect(actual).toEqual({ id: msg.id, ...input });
  });
});
