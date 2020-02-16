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
