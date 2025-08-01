import { BadgeHubData } from "@domain/BadgeHubData";
import { getAndAssertEnv } from "@shared/config/sharedConfig";
import mqtt from "mqtt";

export async function startMqtt(badgeHubData: BadgeHubData) {

  const username = getAndAssertEnv("MQTT_USER");
  const password = getAndAssertEnv("MQTT_PASSWD");
  const topic = getAndAssertEnv("MQTT_TOPIC");
  const server = getAndAssertEnv("MQTT_SERVER");
  const interval = getAndAssertEnv("MQTT_INTERVAL_SEC");


  let client = mqtt.connect(server, {
    username,password
  });

  setInterval(async () => {
    const stats = await badgeHubData.getStats();

    client.publish(topic, JSON.stringify(stats))
  }, 10_000)
}