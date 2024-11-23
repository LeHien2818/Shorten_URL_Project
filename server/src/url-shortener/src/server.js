import express from 'express'
import bodyParser from 'body-parser'
import urlShortenerRoute from './routes/url-shortener-route.js'
import cors from 'cors'
import { sequelize } from './models/index.js';
import cacheConfig from './config/cache.js';
import redis from 'redis';
import KafkaConfig from './config/kafka.js';
import { startCreateConsumer } from './services/create-url-consumer.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }))
//config bodyParser
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


// Add Kafka
console.log("before registered...");
KafkaConfig.connectProducer().then(()=>{
    app.use('/shorten', urlShortenerRoute(redisClient));

    console.log("before create consumer");
    startCreateConsumer().catch((err) => {
        console.error("Error starting create consumer:", err);
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
console.log("producer registered");

