const memoryCache = require('memory-cache');
const memCache = new memoryCache.Cache();

module.exports = {
    getCache: (key) => {
        return (req, res, next) => {
            const cacheContent = memCache.get(key);
    
            if (cacheContent) {
                return res.send(cacheContent);
            }
    
            next()
        }
    },
    setCache: (key, data, durationSec = 59) => {
        memCache.put(key, data, durationSec * 1000);
    }
}