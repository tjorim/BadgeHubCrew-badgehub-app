import mqtt from "mqtt";

const topic = process.env.MQTT_TOPIC;
const server = process.env.MQTT_SERVER;

const client = mqtt.connect(server, {
  protocolVersion: 4,
  keepalive: 60,
  clean: true,
  reconnectPeriod: 1000
});

client.on('connect', function () {
  console.log(`Connected to ${server}`);

  // Subscribe to all topics (use carefully)
  client.subscribe('#', function (err) {
    if (!err) {
      console.log('Subscribed to all topics');
    } else {
      console.error('Subscription error:', err);
    }
  });

  // Or subscribe to Badgehub topic
  // client.subscribe(topic);
});

client.on('message', function (topic, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Topic: ${topic}`);
  console.log(`Message: ${message.toString()}`);
  console.log('---');
});

client.on('error', function (error) {
  console.error('Connection error:', error);
});

client.on('close', function () {
  console.log('Connection closed');
});