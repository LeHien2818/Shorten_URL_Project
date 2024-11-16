const cacheConfig = {
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || '6379'
};

export default cacheConfig;
