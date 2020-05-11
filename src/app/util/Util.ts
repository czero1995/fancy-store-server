import utils from "utility";
const salt = "fancy_store_3987!~@xxx";
import crypto from "crypto";
const CRYPTOJSP_KEY = "fancyStoreServer";
export function md5Pwd(pwd) {
  return utils.md5(utils.md5(pwd + salt));
}

export function encode(code) {
  console.log("加密");
  return utils.base64encode(code);
}

export function decode(code) {
  return utils.base64decode(code);
}

export function checkUid(uid: number, msg: string): void {
  if (!uid) {
    throw { code: -1, msg };
  }
}
export function checkField(val, msg: string): void {
  if (!val) {
    throw { code: -1, msg };
  }
}

export function veifyField(val: object) {
  Object.keys(val).map(item => {
    if (val[item]) {
      throw { code: -1, msg: val[item] };
    }
  });
}

export function encrypt(str) {
  const cipher = crypto.createCipher("aes192", CRYPTOJSP_KEY);
  let enc = cipher.update(str, "utf8", "hex");
  enc += cipher.final("hex");

  return enc;
}

export function decrypt(str) {
  const decipher = crypto.createDecipher("aes192", CRYPTOJSP_KEY);
  let dec = decipher.update(str, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}
