import express from "express";

import { sequelize } from "./models/index.js";
import { startClicksConsumer } from "./services/clicks-consumer.js";
import { startTopUrlConsumer } from "./services/top-url-consumer.js";

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

startClicksConsumer().catch((err) => {
  console.error("Error starting clicks consumer:", err);
});

startTopUrlConsumer().catch((err) => {
  console.error("Error starting top url consumer:", err);
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
