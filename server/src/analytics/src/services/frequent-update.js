import cron from "node-cron";
import db from "../models/index.js"; // Import db chứa sequelize và các models
const { Url } = db;

export default (redisClient) => {
  // every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    console.log("Frequent updating top urls...");
    const topUrls = await Url.findAll({
      order: [["clicks", "DESC"]],
      limit: 10,
    });

    // save to redis
    topUrls.forEach(async (url) => {
      await redisClient.setEx(`url:${url.urlCode}`, 3600, JSON.stringify(url));
    });
  });
};
