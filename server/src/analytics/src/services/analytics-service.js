import Url from '../models/Url.js';
import cron from 'node-cron';
import cacheConfig from '../config/cache.js';
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
class AnalyticsService {
    async updateTop5Urls() {
        try {
            // Fetch 5 most clicked URLs
            const topUrls = await Url.find().sort({ clicks: -1 }).limit(5);

            console.log('Updated top 5 URLs in Redis');

            // print the top 5 urls in redis
            // const topUrlsInRedis = await redisClient.keys('*');
            // console.log('Top 5 URLs in Redis:', topUrlsInRedis);

            // Clear the existing data in Redis
            await redisClient.flushAll();

            // Reset in Redis for the top 5 URLs
            topUrls.forEach(async (url) => {
                await redisClient.set(url.shortUrl, url.longUrl);
            });

            // console.log('Top 5 URLs:', topUrls);
        } catch (error) {
            console.error('Error updating top 5 URLs:', error);
        }
    }

    startScheduler() {
        // Run the job every 10 seconds
        // Can be changed to run at a different interval
        // 10 * * * * -> every 10 mins
        cron.schedule('*/10 * * * * *', () => {
            console.log('Running job to update top 5 URLs');
            this.updateTop5Urls();
        });
    }
}

export default new AnalyticsService();
