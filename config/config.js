module.exports = {
  // MongoDB配置
  dbConnect: 'mongodb://localhost/fancystore',
  qiniu: {
    AccessKey: '输入七牛云AccessKey',
    SecretKey: '输入七牛云SecretKey',
    Bucket: 'fancy-store',
    Port: 9000,
    UptokenUrl: 'fancy-store',
    Domain: 'http://qiniu.fancystore.cn/'
  },
  redis: 'redis://localhost:6379',
  REDIS_PRODECT_PREFIX: 'fancystore'
}
