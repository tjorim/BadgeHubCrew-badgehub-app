import mqtt from "mqtt";

const topic = process.env.MQTT_TOPIC;
const server = process.env.MQTT_SERVER;

const topicOnly = true; // true: only listen to topic, false: llisten to all topics

const client = mqtt.connect(server, {
  protocolVersion: 4,
  keepalive: 60,
  clean: true,
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log(`Connected to ${server}`);

  client.subscribe(topicOnly ? topic : "#", (err) => {
    if (!err) {
      console.log(`Subscribed ${topicOnly ? topic : "to all topics"}`);
    } else {
      console.error("Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Topic: ${topic}`);
  console.log(`Message: ${message.toString()}`);
  console.log("---");
});

client.on("error", (error) => {
  console.error("Connection error:", error);
});

client.on("close", () => {
  console.log("Connection closed");
});
