class LRUCache {
  constructor(max, maxAge) {
    this.max = max;
    this.maxAge = maxAge;
    this.cache = new Map();
    this.timestamps = new Map();
  }

  generateKey(req) {
    const { method, url, query, headers } = req;
    return `${method}:${url}:${JSON.stringify(query)}:${JSON.stringify(headers)}`;
  }

  set(key, value) {
    if (this.cache.size >= this.max) {
      const oldestKey = [...this.cache.keys()].reduce((oldest, key) =>
        this.timestamps.get(key) < this.timestamps.get(oldest) ? key : oldest
      );
      this.cache.delete(oldestKey);
      this.timestamps.delete(oldestKey);
    }
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  get(key) {
    const now = Date.now();
    if (this.cache.has(key)) {
      this.timestamps.set(key, now);
      const item = this.cache.get(key);
      if (now - this.timestamps.get(key) > this.maxAge) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        return null;
      }
      return item;
    }
    return null;
  }
}

class CacheMiddleware {
  constructor(options) {
    this.cache = new LRUCache(options.max || 50, options.maxAge || 30000);
  }

  handleCache(req, res, next) {
    const key = this.cache.generateKey(req);
    const cachedResponse = this.cache.get(key);

    if (cachedResponse) {
      res.status(cachedResponse.status);
      res.json(cachedResponse.body);
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      const responseToCache = {
        status: res.statusCode,
        body,
      };
      this.cache.set(key, responseToCache);
      return originalJson(body);
    };

    next();
  }
}

export default CacheMiddleware;
