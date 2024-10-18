import express from 'express'
import connectDB from './config/database.js'
import bodyParser from 'body-parser'
import urlExpanderRoute from './routes/url-expander-route.js'
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

const app = express()
const PORT = 3002

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB()

app.use('/', urlExpanderRoute(redisClient))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});