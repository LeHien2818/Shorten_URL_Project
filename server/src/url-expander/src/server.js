import express from 'express'
import bodyParser from 'body-parser'
import urlExpanderRoute from './routes/url-expander-route.js'
import { sequelize } from './models/index.js';
import cacheConfig from './config/cache.js';
import redis from 'redis';
import KafkaConfig from './config/kafka.js';

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
    
redisClient.flushAll();
// Add Kafka
KafkaConfig.connectProducer();

app.use('/', urlExpanderRoute(redisClient))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});