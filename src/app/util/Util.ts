import utils from "utility";
export function md5Pwd(pwd) {
  const salt = "fancy_store_3987!~@xxx";
  return utils.md5(utils.md5(pwd + salt));
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
