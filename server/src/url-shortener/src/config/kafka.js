import { Kafka } from "kafkajs";

class KafkaConfig {
  constructor(groupId) {
    this.kafka = new Kafka({
      clientId: "shortener-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:29092"],
    });
    this.consumer = this.kafka.consumer({ groupId: groupId, maxWaitTimeInMs: 3000 });
    this.producer = this.kafka.producer();
    
  }

  async connectProducer() {
    if (!this.producer) {
      console.log("producer exception jumps in");
      return;
    }
    console.log("Kafka Producer connected...");
    await this.producer.connect();
  }

  async disconnectProducer() {
    if (!this.producer) {
      return;
    }
    await this.producer.disconnect();
    console.log(`Kafka producer disconnected...`);
  }

  async connectConsumer() {
    await this.consumer.connect();
    console.log(`Kafka consumer connected...`);
  }

  async disconnectConsumer() {
    await this.consumer.disconnect();
    console.log(`Kafka consumer disconnected...`);
  }

  async consume(topic, callback) {
    try {
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.log("The Kafka Consume error", error);
    }
  }

  async produce(topic, messages) {
    if (!this.producer) {
      return;
    }
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

const kafkaConfigInstance = new KafkaConfig("url_created");

export default kafkaConfigInstance;
