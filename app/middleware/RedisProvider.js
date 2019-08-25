import _ from 'lodash';
import SleepHelper from '../helpers/SleepHelper';
import RedisClientHelper from '../helpers/RedisClientHelper';

export default class RedisProvider {

  constructor(options) {
    this.client = RedisClientHelper.newInstance(options.host, options.port, options.password);
  }

  async set(key, value, nx = false, timeout = 0) {
    let params = [];
    if (nx) {
      params.push('NX');
    }
    if (timeout > 0) {
      params.push('EX');
      params.push(timeout);
    }
    return new Promise((resolve, reject) => {
      this.client.set(key, value, ...params, function (err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(result === 'OK');
        }
      });
    });
  }

  async expire(key, timeout) {
    return new Promise((resolve, reject) => {
      this.client.expire(key, timeout, function (err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }


  async expireat(key, endUnixTime) {
    return new Promise((resolve, reject) => {
      this.client.expireat(key, endUnixTime, function (err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, function (err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(result === 1);
        }
      });
    });
  }

  async incr(key, timeout) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.client.incr(key, async function (err, result) {
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

  async hset(key, field, value) {
    return new Promise((resolve, reject) => {
      this.client.hset(key, field, value, function (err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  async hget(key, field) {
    return new Promise((resolve, reject) => {
      this.client.hget(key, field, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  async sadd(key, members) {
    return new Promise((resolve, reject) => {
      this.client.sadd(key, members, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }


  async smembers(key) {
    return new Promise((resolve, reject) => {
      this.client.smembers(key, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }


  async spop(key, count = 1) {
    return new Promise((resolve, reject) => {
      this.client.spop(key, count, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  async scard(key) {
    return new Promise((resolve, reject) => {
      this.client.scard(key, function (err, result) {
        if (err) {
          resolve(0);
        } else {
          resolve(result);
        }
      });
    });
  }

  async srem(key, members) {
    return new Promise((resolve, reject) => {
      this.client.srem(key, members, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async zadd(key, score, memberId) {
    return new Promise((resolve, reject) => {
      this.client.zadd(key, score, memberId, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }


  async zrevrank(key, memberId) {
    return new Promise((resolve, reject) => {
      this.client.zrevrank(key, memberId, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  async llen(key){
    return new Promise((resolve, reject) => {
      this.client.llen(key, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async lpop(key){
    return new Promise((resolve, reject) => {
      this.client.lpop(key, function (err, result) {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  async rpush(key, values){
    return new Promise((resolve, reject) => {
      this.client.rpush(key, values, function (err, result) {
        if (err) {
          resolve(0);
        } else {
          resolve(result);
        }
      });
    });
  }

  async tryLock(type, lockId, timeout = 3, retry = 1) {
    for (let i = 0; i < retry; i++) {
      let result = await this.__tryLock(type, lockId, timeout);
      if (result) {
        return result;
      }
      await SleepHelper.sleep(1);
    }
  }

  async unLock(type, lockId, lockOwner) {
    if (!lockOwner) {
      return false;
    }
    let key = getLockKey(type, lockId);
    return new Promise((resolve, reject) => {
      this.client.del(key, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result === 1);
        }
      });
    });
  }

  async tryLockTrade(familyId, retry = 1) {
    for (let i = 0; i < retry; i++) {
      let result = await this.tryLock('trade', familyId, 20, retry);
      if (result) {
        return result;
      }
      await SleepHelper.sleep(1);
    }
  }

  async unLockTrade(familyId, lockOwner) {
    if (!lockOwner) {
      return false;
    }
    return await this.unLock('trade', familyId, lockOwner);
  }

  async __tryLock(type, lockId, timeout) {
    let key = getLockKey(type, lockId);
    return new Promise((resolve, reject) => {
      this.client.set(key, '1', 'EX', timeout, 'NX', function (err, result) {
        if (err) {
          resolve(false);
        } else {
          resolve(result === 'OK');
        }
      });
    });
  }

}

function getLockKey(type, lockId) {
  return `lock_${type}_${lockId}`;
}

