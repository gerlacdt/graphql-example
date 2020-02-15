export function foo({ id }: { id: string }): number {
  const table: { [key: string]: number } = { a: 42, b: 100 };
  const result = table[id];
  console.log("foo(%s) = %s", id, result);
  if (!result) {
    return 666;
  }
  return result;
}

export function hello(): string {
  console.log("hello()");
  return "Hello world!";
}
