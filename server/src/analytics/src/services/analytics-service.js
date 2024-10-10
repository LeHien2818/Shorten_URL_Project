import Url from '../models/Url.js';
import cron from 'node-cron';
// import cacheConfig from '../config/cache.js';
// import redis from 'redis';

// const redisClient = redis.createClient(cacheConfig.redisHost, cacheConfig.redisPost);

// await redisClient.connect();

class AnalyticsService {
    async updateTop5Urls() {
        try {
            // Fetch 5 most clicked URLs
            const topUrls = await Url.find().sort({ clicks: -1 }).limit(5);


            console.log('Updated top 5 URLs in Redis');
            // await redisClient.flushAll();

            // Reset in Redis for the top 5 URLs
            // topUrls.forEach(async (url) => {
            //     await redisClient.set(url.shortUrl, url.longUrl);
            // });

            console.log('Top 5 URLs:', topUrls);
        } catch (error) {
            console.error('Error updating top 5 URLs:', error);
        }
    }

    startScheduler() {
        // Run the job every 10 seconds
        cron.schedule('*/10 * * * * *', () => {
            console.log('Running job to update top 5 URLs');
            this.updateTop5Urls();
        });
    }
}

export default new AnalyticsService();
