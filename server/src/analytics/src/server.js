import express from "express";

import { sequelize } from "./models/index.js";
// import { startClicksConsumer } from "./services/clicks-consumer.js";
import { startTopUrlConsumer } from "./services/top-url-consumer.js";
// import { startCreateConsumer } from "./services/create-url-consumer.js";
import frequentUpdate from "./services/frequent-update.js";
import cacheConfig from "./config/cache.js";
import redis from "redis";

const app = express();

// connect DB
sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

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

// startClicksConsumer().catch((err) => {
//   console.error("Error starting clicks consumer:", err);
// });

startTopUrlConsumer(redisClient).catch((err) => {
  console.error("Error starting top url consumer:", err);
});

// startCreateConsumer().catch((err) => {
//   console.error("Error starting create consumer:", err);
// });
frequentUpdate(redisClient);

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
