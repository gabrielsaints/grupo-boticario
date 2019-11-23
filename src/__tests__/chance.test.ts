import chance from './utils/chance';

describe('Chance', () => {
  it('`chance` should return an int valid number', () => {
    expect.assertions(1);
    const generatedNumber = chance.int();
    expect(
      generatedNumber >= -2147483648 && generatedNumber <= 2147483647,
    ).toBe(true);
  });

  it('`chance` should return an positive number', () => {
    expect.assertions(1);
    const generatedNumber = chance.identity();
    expect(generatedNumber > 0).toBe(true);
  });
});
