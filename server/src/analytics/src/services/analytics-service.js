import Url from "../models/Url";
import Redis from "ioredis";
import cron from 'node-cron';

// Redis client
const redisClient = new Redis({
    host: 'localhost',
    port: 6379
});

class AnalyticsService {
    async updateTop5Urls() {
        try {
            // Fetch 5 most clicked URLs
            const topUrls = await Url.find().sort({ clicks: -1 }).limit(5);


            // Reset in Redis
            await redisClient.del("top5urls");
            topUrls.forEach(async (url, index) => {
                await redisClient.zadd("top5urls", index + 1, JSON.stringify(url));
            });

            console.log('Updated top 5 URLs in Redis');
        } catch (error) {
            console.error('Error updating top 5 URLs:', error);
        }
    }

    startScheduler() {
        cron.schedule('*/10 * * * *', () => {
            console.log('Running job to update top 5 URLs');
            this.updateTop5Urls();
        });
    }
}

export default new AnalyticsService();
