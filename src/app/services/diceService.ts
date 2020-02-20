export class DiceService {
  constructor(public numSides: number) {}

  public rollOnce(): number {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  public roll({ numRolls }: { numRolls: number }): number[] {
    const output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}
