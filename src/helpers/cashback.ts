abstract class CashbackHelper {
  public static percentage(price: number): number {
    if (price > 1000 && price < 1500) {
      return 0.15;
    }

    if (price >= 1500) {
      return 0.2;
    }

    return 0.1;
  }

  public static calculate(price: number): number {
    return parseFloat((price * this.percentage(price)).toFixed(2));
  }
}

export default CashbackHelper;
