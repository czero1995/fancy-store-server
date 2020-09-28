const DBNAME = {
  dev: "fancystoredemo",
  prod: "fancystore"
};
const DBCONNECT = {
  dev: "mongodb://localhost/fancystoredemo",
  prod: "mongodb://localhost/fancystore"
};
export default {
  serverPort: 9093,
  dbName: process.env.NODE_ENV === "dev" ? DBNAME.dev : DBNAME.prod,
  dbConnect: process.env.NODE_ENV === "dev" ? DBCONNECT.dev : DBCONNECT.prod,
  qiniu: {
    AccessKey: "输入七牛云AccessKey",
    SecretKey: "输入七牛云SecretKey",
    Bucket: "fancy-store",
    Port: 9000,
    UptokenUrl: "fancy-store",
    Domain: "http://qiniu.fancystore.cn/"
  },
  wx: {
    APPID: "微信appid",
    SECRET: "微信secret",
    signatureToken: "fancystore"
  },
  wxWeb: {
    APPID: "微信appid",
    SECRET: "微信secret"
  },
  redis: "redis://localhost:6379",
  REDIS_PRODECT_PREFIX: "fancystore"
};
