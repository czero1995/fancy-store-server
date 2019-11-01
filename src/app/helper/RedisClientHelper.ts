import redis from "redis";

export default class RedisClientHelper {
  public static newInstance(host: any, retryTime = 1000 * 2, attempt = 10) {
    const client = redis.createClient({
      host,
      retry_strategy: options => {
        if (options.error && options.error.code === "ECONNREFUSED") {
          return new Error("The server refused the connection");
        }
        if (options.total_retry_time > retryTime) {
          return new Error("Retry time exhausted");
        }
        if (options.attempt > attempt) {
          return new Error("No response");
        }
        return Math.min(options.attempt * 100, 200);
      }
    });
    // client.on('connect', message => {
    //   console.log(`redis connect: ${message}`)
    // })
    // client.on('reconnecting', message => {
    //   console.log(`redis reconnection:${message}`)
    // })
    // client.on('error', message => {
    //   console.log(`redis error:${message}`)
    // })
    // client.on('end', message => {
    //   console.log(`redis end:${message}`)
    // })
    return client;
  }
}
