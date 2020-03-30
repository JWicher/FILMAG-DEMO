const memoryCache = require('memory-cache');

const memCache = new memoryCache.Cache();

const getCache = (key) => {
    return (req, res, next) => {

        const cacheContent = memCache.get(key);

        if (cacheContent) {
            return res.send(cacheContent);
        }

        next()
    }
}

const setCache = (key, data, duration) => {
    memCache.put(key, data, duration * 1000);
}


module.exports = {
    getCache,
    setCache
}