import express from 'express';
import connectDB from './config/database.js';
import analyticsService from './services/analytics-service.js';
import cacheConfig from './config/cache.js';
import redis from 'redis';

const redisClient = redis.createClient({
    socket: {
        host: cacheConfig.redisHost,
        port: cacheConfig.redisPort,
    }
});

redisClient.connect()
    .then(() => {
        console.log('Connected to Redis');
    })
    .catch((err) => {
        console.error('Redis connection error:', err);
    });

const app = express();

connectDB();
// redisClient.flushAll();

analyticsService.startScheduler(redisClient);

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
