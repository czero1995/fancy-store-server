import redis from 'redis';

export default class RedisClientHelper {

  static newInstance(host, port, password, retryTime = 1000 * 60 * 60, attempt = 10) {
    return redis.createClient({
      host: host,
      port: port,
      password: password,
      retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > retryTime) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > attempt) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });
  }

}
