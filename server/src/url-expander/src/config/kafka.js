import { Kafka } from "kafkajs";
import db from "../models/index.js"; // Import db chứa sequelize và các models

const { Url } = db;

class KafkaConfig {
  static instance;
  constructor() {
    if (KafkaConfig.instance) {
      return KafkaConfig.instance;
    }

    this.kafka = new Kafka({
      clientId: "expander-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:29092"],
    });

    this.producer = this.kafka.producer();

    KafkaConfig.instance = this;
  }

  async connectProducer() {
    await this.producer.connect();
    console.log("Kafka Producer connected...");
  }

  async disconnectProducer() {
    await this.producer.disconnect();
    console.log(`Kafka producer disconnected...`);
  }

  async produce(topic, messages) {
    try {
      await this.producer.send({
        topic: topic,
        messages: [
          {
            key: messages.urlCode,
            value: JSON.stringify(messages),
          },
        ],
      });
    } catch (error) {
      console.log("Kafka producer error", error);
    }
  }
}

const kafkaConfigInstance = new KafkaConfig();

export default kafkaConfigInstance;
