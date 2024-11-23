import { Kafka } from "kafkajs";

class KafkaConfig {
  constructor(groupId, consumerOnly = true) {
    this.kafka = new Kafka({
      clientId: "analytics-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:29092"],
    });
    this.consumer = this.kafka.consumer({ groupId: groupId, maxWaitTimeInMs: 3000 });
    if (!consumerOnly) {
      this.producer = this.kafka.producer();
    }
  }

  async connectProducer() {
    if (!this.producer) {
      return;
    }
    await this.producer.connect();
    console.log("Kafka Producer connected...");
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

const kafkaConfigInstances = new Map();

// kafkaConfigInstances.set("url_created_group", new KafkaConfig("url_created"));
// kafkaConfigInstances.set("url_clicked_group", new KafkaConfig("url_clicked", false));
kafkaConfigInstances.set("top_url_group", new KafkaConfig("top_url"));

export { kafkaConfigInstances };
