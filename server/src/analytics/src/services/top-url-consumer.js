import { kafkaConfigInstances } from "../config/kafka.js";
import db from "../models/index.js"; // Import db chứa sequelize và các models
const { Url } = db;

const topUrlConsumer = kafkaConfigInstances.get("top_url_group");

const BATCH_SIZE = 15;//can fix
const FLUSH_INTERVAL = 10000;//can fix

let messages = 0;

const flushBatch = async (redisClient) => {
  if (messages > 0) {
    try {
      console.log("Flushing batch...");

      const topUrls = await Url.findAll({
        order: [["clicks", "DESC"]],
        limit: 10,
      });

      // save to redis
      topUrls.forEach(async (url) => {
        await redisClient.setEx(`url:${url.urlCode}`, 3600, JSON.stringify(url));
      });

      // Clear the batch
      messages = 0;
    } catch (error) {
      console.error("Error update top url:", error);
    }
  }
};

export const startTopUrlConsumer = async (redisClient) => {
  await topUrlConsumer.connectConsumer();

  setInterval(flushBatch, FLUSH_INTERVAL);
  await topUrlConsumer.consume("top_url", async (value) => {
    messages++;
    console.log(`Received total ${messages} messages`);

    if (messages >= BATCH_SIZE) {
      await flushBatch(redisClient);
    }
  });
};
