abstract class CashbackHelper {
  public static calculate(price: number): number {
    if (price > 1000 && price < 1500) {
      return parseFloat((price * 0.15).toFixed(2));
    }

    if (price >= 1500) {
      return parseFloat((price * 0.2).toFixed(2));
    }

    return parseFloat((price * 0.1).toFixed(2));
  }
}

export default CashbackHelper;
