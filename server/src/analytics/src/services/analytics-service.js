import Url from "../models/Url.js";
import cron from "node-cron";

class AnalyticsService {
    async updateTop10Urls(redisClient) {
        try {
            // Fetch 10 most clicked URLs
            const topUrls = await Url.find().sort({ clicks: -1 }).limit(10);

            console.log("Updated top 10 URLs in Redis");

            // Clear the existing data in Redis
            const keys = await redisClient.keys("hot:url:*");
            if (keys.length > 0) {
                await redisClient.del(keys);
            }

            // Reset in Redis for the top 10 URLs
            topUrls.forEach(async (url) => {
                await redisClient.setEx(
                    `hot:url:${url.urlCode}`,
                    3600,
                    JSON.stringify({ longUrl: url.longUrl, clicks: url.clicks })
                );
            });
        } catch (error) {
            console.error("Error updating top 10 URLs:", error);
        }
    }

    async syncCacheToDB(redisClient) {
        try {
            let keysToSync = [];
            const bulkOperations = [];

            const hotKeys = await redisClient.keys("hot:url:*");
            const normKeys = await redisClient.keys("url:*");

            keysToSync = keysToSync.concat(hotKeys);
            keysToSync = keysToSync.concat(normKeys);

            console.log(keysToSync);
            // sync
            for (const key of keysToSync) {
                const data = await redisClient.get(key);
                if (data) {
                    const urlData = JSON.parse(data);

                    // creat bulk operation
                    const filter = { urlCode: key.split(":")[1] };
                    const update = {
                        $set: {
                            longUrl: urlData.longUrl,
                            clicks: urlData.clicks,
                        },
                    };

                    bulkOperations.push({
                        updateOne: {
                            filter: filter,
                            update: update,
                            upsert: true,
                        },
                    });
                }
            }

            if (bulkOperations.length > 0) {
                await Url.bulkWrite(bulkOperations);
                console.log("Synced cache to DB");
            }
        } catch (error) {
            console.log("Error syncing cache to DB", error);
        }
    }

    startScheduler(redisClient) {
        // Run the job every 10 seconds
        // Can be changed to run at a different interval
        // 10 * * * * -> every 10 mins
        cron.schedule("*/10 * * * * *", () => {
            this.syncCacheToDB(redisClient);
            this.updateTop10Urls(redisClient);
        });
    }
}

export default new AnalyticsService();
