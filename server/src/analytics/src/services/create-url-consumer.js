import { kafkaConfigInstances } from "../config/kafka.js";
import db from "../models/index.js"; // Import db chứa sequelize và các models
const { Url } = db;

const createConsumer = kafkaConfigInstances.get("url_created_group");

const BATCH_SIZE = 20;//can fix
const FLUSH_INTERVAL = 10000;//can fix

let batch = [];

const flushBatch = async () => {
  if (batch.length > 0) {
    try {
      console.log("Flushing batch...");

      // Thêm tất cả các URL từ batch vào database
      await Url.bulkCreate(batch, { ignoreDuplicates: true });

      console.log(`Inserted ${batch.length} URLs into the database`);

      // Clear the batch
      batch = [];
    } catch (error) {
      console.error("Error adding URLs to the database:", error);
    }
  }
};

export const startCreateConsumer = async () => {
  await createConsumer.connectConsumer();

  setInterval(flushBatch, FLUSH_INTERVAL);

  await createConsumer.consume("url_created", async (value) => {
    const url = JSON.parse(value);

    batch.push(url);
    console.log(`Received URL, total messages in batch: ${batch.length}`);

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  });
};
