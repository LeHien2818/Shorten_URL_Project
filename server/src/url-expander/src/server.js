import express from 'express'
import bodyParser from 'body-parser'
import urlExpanderRoute from './routes/url-expander-route.js'
import { sequelize } from './models/index.js';
import cacheConfig from './config/cache.js';
import redis from 'redis';
import KafkaConfig from './config/kafka.js';
import { startClicksConsumer } from './services/clicks-consumer.js';
const app = express()
const PORT = 3002

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// connect DB
sequelize.sync({ force: false, alter: true }).then(() => {
    console.log("Database synchronized");
}).catch(err => {
    console.error("Error syncing database:", err);
});

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
redisClient.configSet('maxmemory-policy', 'volatile-ttl', (err, result) => {
    if (err) {
        console.error('Error setting maxmemory-policy:', err);
    } else {
        console.log('maxmemory-policy set to volatile-ttl');
    }
});

redisClient.configSet('maxmemory', '8gb', (err, result) => {
    if (err) {
        console.error('Error setting maxmemory:', err);
    } else {
        console.log('Maxmemory set to 8gb');
    }
});

redisClient.flushAll();
// Add Kafka
KafkaConfig.connectProducer();

app.use('/', urlExpanderRoute(redisClient))


startClicksConsumer().catch((err) => {
    console.error("Error starting clicks consumer:", err);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});