import Url from "../models/Url.js";
import cron from "node-cron";

class AnalyticsService {
    async updateTop10Urls(redisClient) {
        try {
            // Fetch 10 most clicked URLs
            const topUrls = await Url.find().sort({ clicks: -1 }).limit(10);
            console.log("Updated top 10 URLs in Redis");

            // Clear the existing data in Redis using SCAN for better performance
            const hotKeys = await redisClient.keys("hot:url:*");
            if (hotKeys.length > 0) {
                await redisClient.del(hotKeys);
            }

            // Reset in Redis for the top 10 URLs
            for (const url of topUrls) {
                await redisClient.setEx(
                    `hot:url:${url.urlCode}`,
                    3600,
                    JSON.stringify({ longUrl: url.longUrl, clicks: url.clicks })
                );
            }
        } catch (error) {
            console.error("Error updating top 10 URLs:", error);
        }
    }

    async syncCacheToDB(redisClient) {
        try {
            const bulkOperations = [];
            const hotKeys = await redisClient.keys("hot:url:*");
            const normKeys = await redisClient.keys("url:*");
            const keysToSync = [...hotKeys, ...normKeys];
            console.log(keysToSync);

            // Sync
            for (const key of keysToSync) {
                const parts = key.split(":");
                if (parts.length < 2) {
                    console.warn(`Invalid key format: ${key}`);
                    continue;
                }
                const urlCode = parts[parts.length - 1];

                const data = await redisClient.get(key);
                if (data) {
                    let urlData;
                    try {
                        urlData = JSON.parse(data);
                    } catch (error) {
                        console.warn(`Invalid JSON data for key: ${key}`, error);
                        continue;
                    }

                    // Create bulk operation
                    const filter = { urlCode: urlCode };
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
        cron.schedule("*/10 * * * * *", async () => {
            await this.syncCacheToDB(redisClient);
            await this.updateTop10Urls(redisClient);
        });
    }
}

export default new AnalyticsService();
