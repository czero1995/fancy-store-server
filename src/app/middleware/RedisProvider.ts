// import redis from '@config/redis'
import config from "@config/config";
export default class RedisProvider {
  protected redis: any;
  protected config: any;
  constructor(redis) {
    this.redis = redis;
    this.config = config;
  }
  public getKey(value: string, id: string) {
    return `${this.config.REDIS_PRODECT_PREFIX}-${value}-${id}`;
  }
  public getRedisPREFIX() {
    return `${this.config.REDIS_PRODECT_PREFIX}`;
  }
  public async set(key, value, nx = false, timeout = 0) {
    const params: any[] = [];
    if (nx) {
      params.push("NX");
    }
    if (timeout > 0) {
      params.push("EX");
      params.push(timeout);
    }
    return new Promise((resolve, reject) => {
      this.redis.set(key, JSON.stringify(value), ...params, function(
        err,
        result
      ) {
        if (err) {
          resolve(false);
        } else {
          resolve(result === "OK");
        }
      });
    });
  }

  public async expire(key, timeout) {
    return new Promise((resolve, reject) => {
      this.redis.expire(key, timeout, function(err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public async expireat(key, endUnixTime) {
    return new Promise((resolve, reject) => {
      this.redis.expireat(key, endUnixTime, function(err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public async get(key) {
    return new Promise((resolve, reject) => {
      this.redis.get(key, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(result));
        }
      });
    });
  }

  public async del(key) {
    return new Promise((resolve, reject) => {
      this.redis.del(key, function(err, result) {
        if (err) {
          console.log("err: ", err);
          resolve(false);
        } else {
          resolve(result === 1);
        }
      });
    });
  }

  public async incr(key, timeout) {
    const _this = this;
    return new Promise((resolve, reject) => {
      this.redis.incr(key, async function(err, result) {
        if (err) {
          resolve(false);
        } else {
          if (result === 1) {
            await _this.expire(key, timeout);
          }
          resolve(result);
        }
      });
    });
  }

  public async hset(key, field, value) {
    return new Promise((resolve, reject) => {
      this.redis.hset(key, field, value, function(err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public async hget(key, field) {
    return new Promise((resolve, reject) => {
      this.redis.hget(key, field, function(err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async sadd(key, members) {
    return new Promise((resolve, reject) => {
      this.redis.sadd(key, members, function(err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async smembers(key) {
    return new Promise((resolve, reject) => {
      this.redis.smembers(key, function(err, result: any) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async spop(key, count = 1) {
    return new Promise((resolve, reject) => {
      this.redis.spop(key, count, function(err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async scard(key) {
    return new Promise((resolve, reject) => {
      this.redis.scard(key, function(err, result) {
        if (err) {
          resolve(0);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async srem(key, members) {
    return new Promise((resolve, reject) => {
      this.redis.srem(key, members, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async zadd(key, score, memberId) {
    return new Promise((resolve, reject) => {
      this.redis.zadd(key, score, memberId, function(err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async zrevrank(key, memberId) {
    return new Promise((resolve, reject) => {
      this.redis.zrevrank(key, memberId, function(err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async llen(key) {
    return new Promise((resolve, reject) => {
      this.redis.llen(key, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async lpop(key) {
    return new Promise((resolve, reject) => {
      this.redis.lpop(key, function(err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async rpush(key, values) {
    return new Promise((resolve, reject) => {
      this.redis.rpush(key, values, function(err, result) {
        if (err) {
          resolve(0);
        } else {
          resolve(result);
        }
      });
    });
  }

  public async tryLock(type, lockId, timeout = 3, retry = 1) {
    for (let i = 0; i < retry; i++) {
      const result = await this.__tryLock(type, lockId, timeout);
      if (result) {
        return result;
      }
    }
  }

  public async unLock(type, lockId, lockOwner) {
    if (!lockOwner) {
      return false;
    }
    const key = getLockKey(type, lockId);
    return new Promise((resolve, reject) => {
      this.redis.del(key, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result === 1);
        }
      });
    });
  }

  public async tryLockTrade(familyId, retry = 1) {
    const result = await this.tryLock("trade", familyId, 20, retry);
    return result;
  }

  public async unLockTrade(familyId, lockOwner) {
    if (!lockOwner) {
      return false;
    }
    return await this.unLock("trade", familyId, lockOwner);
  }

  public async __tryLock(type, lockId, timeout) {
    const key = getLockKey(type, lockId);
    return new Promise((resolve, reject) => {
      this.redis.set(key, "1", "EX", timeout, "NX", function(err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(result === "OK");
        }
      });
    });
  }
}

function getLockKey(type, lockId) {
  return `lock_${type}_${lockId}`;
}
