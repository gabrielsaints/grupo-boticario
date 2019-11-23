import bcryptjs from 'bcryptjs';

abstract class EncryptionHelper {
  public static async encryptPassword(password: string) {
    return await bcryptjs.hash(password, 12);
  }

  public static async comparePassword(password: string, hash: string) {
    return await bcryptjs.compare(password, hash);
  }
}

export default EncryptionHelper;
