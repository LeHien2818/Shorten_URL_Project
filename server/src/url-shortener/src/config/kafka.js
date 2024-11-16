import { Kafka } from "kafkajs";

class KafkaConfig {
  static instance;
  constructor() {
    if (KafkaConfig.instance) {
      return KafkaConfig.instance;
    }

    this.kafka = new Kafka({
      clientId: "shortener-service",
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
        messages: [{ value: JSON.stringify(messages) }],
      });
    } catch (error) {
      console.log("Kafka producer error", error);
    }
  }
}

const kafkaConfigInstance = new KafkaConfig();

export default kafkaConfigInstance;
