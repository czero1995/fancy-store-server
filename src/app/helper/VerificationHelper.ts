export default {
  isNonEmpty(value: string, errorMsg: string) {
    if (value === "" || value === null || value === undefined) {
      return errorMsg;
    }
  },
  isObjectNotEmpty(object: object, value: string, errorMsg: string) {
    if (!object) {
      return errorMsg;
    }
    if (!object[value]) {
      return errorMsg;
    }
  },
  isNumber(value: number, errorMsg: string) {
    if (!value) {
      return `${errorMsg}不可为空`;
    }
    if (typeof value !== "number") {
      return `${errorMsg}不是数字Number`;
    }
  },
  checkArrayNotEmpty(value: any[], errorMsg: string) {
    if (!value || value.length === 0) {
      return errorMsg;
    }
  },
  checkArrayValueNotEmpty(array: any[], value: string, errorMsg: string) {
    let msg: string = "";
    array.map(item => {
      item[value].length < 1 && (msg = errorMsg);
    });
    if (msg !== null) {
      return msg;
    }
  },
  isMobile(value: number, errorMsg: string) {
    if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(value + "")) {
      return errorMsg;
    }
  },
  minLength(value: any[] | string, length: number, errorMsg: string) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isEqual(valueOne: any, valueTwo: any, errMsg: string) {
    if (valueOne !== valueTwo) {
      return errMsg;
    }
  }
};
