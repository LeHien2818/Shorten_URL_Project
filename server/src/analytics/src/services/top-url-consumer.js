import { kafkaConfigInstances } from "../config/kafka.js";
import db from "../models/index.js"; // Import db chứa sequelize và các models
const { Url } = db;
import cacheConfig from "../config/cache.js";
import redis from "redis";

const redisClient = redis.createClient({
  socket: {
    host: cacheConfig.redisHost,
    port: cacheConfig.redisPort,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

const topUrlConsumer = kafkaConfigInstances.get("top_url_group");

const BATCH_SIZE = 15;
const FLUSH_INTERVAL = 1000;

let messages = 0;

const flushBatch = async () => {
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

export const startTopUrlConsumer = async () => {
  await topUrlConsumer.connectConsumer();

  setInterval(flushBatch, FLUSH_INTERVAL);

  await topUrlConsumer.consume("top_url", async (value) => {
    messages++;
    console.log(`Received total ${messages} messages`);

    if (messages >= BATCH_SIZE) {
      await flushBatch();
    }
  });
};
