import  kafkaConfigInstance  from "../config/kafka.js";
import db from "../models/index.js"; // Import db chứa sequelize và các models
import { randomUUID } from "../utils/utils.js";
const { Url } = db;

const createConsumer = kafkaConfigInstance

const BATCH_SIZE = 15;//can fix
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
    console.log("Starting create consumer...");
    console.log(createConsumer);
    
  await createConsumer.connectConsumer();
  console.log("connected succesfully consumer");
  
  setInterval(flushBatch, FLUSH_INTERVAL);

  await createConsumer.consume("url_created", async (value) => {
    console.log("inside consume");
    
    console.log(value);
    
    const url = JSON.parse(value);
    batch.push(url);
    console.log(`Received URL, total messages in batch: ${batch.length}`);
    if (batch.length >= BATCH_SIZE) {
        await flushBatch();
    }
  });
};
