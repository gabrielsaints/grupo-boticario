import Chance from 'chance';

class ExtendedChance extends Chance {
  public int() {
    return super.integer({ min: -2147483648, max: 2147483647 });
  }

  public identity() {
    return super.integer({ min: 1, max: 214748 });
  }
}

export default new ExtendedChance();
