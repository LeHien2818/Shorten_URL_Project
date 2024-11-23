import  kafkaConfigInstance  from "../config/kafka.js";
import db from "../models/index.js"; // Import db chứa sequelize và các models

const { Url } = db;

const clicksConsumer = kafkaConfigInstance

const BATCH_SIZE = 15;// can fix
const FLUSH_INTERVAL = 10000;//can fix

const batchMap = new Map();

const flushBatch = async () => {
  const entries = Array.from(batchMap.entries());

  for (const [urlCode, batch] of entries) {
    if (batch.length > 0) {
      try {
        const totalClicks = batch.length;
        const url = batch[0];

        // Update the URL in the database
        console.log(`Updated URL ${urlCode} with ${totalClicks} clicks`);
        await Url.update({ clicks: db.sequelize.literal(`clicks + ${totalClicks}`) }, { where: { urlCode: urlCode } });

        //send to kafka to update top url
        await clicksConsumer.produce("top_url", url);
        // Clear the batch
        batchMap.set(urlCode, []);
      } catch (error) {
        console.error(`Error updating URL ${urlCode}:`, error);
      }
    }
  }
};

export const startClicksConsumer = async () => {
  await clicksConsumer.connectProducer();
  await clicksConsumer.connectConsumer();

  setInterval(flushBatch, FLUSH_INTERVAL);

  await clicksConsumer.consume("url_clicked", async (value) => {
    const url = JSON.parse(value);

    const existingUrl = await Url.findOne({ where: { urlCode: url.urlCode } });
    if (!existingUrl) {
      return;
    }
    if (!batchMap.has(url.urlCode)) {
      batchMap.set(url.urlCode, []);
    }

    const batch = batchMap.get(url.urlCode);
    batch.push(url);

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  });
};
