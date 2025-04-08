#!/bin/bash

# Kafka broker address
BROKER="localhost:9092"

# Array of topics to add
TOPICS=("audit-trail-topic")

# Delete all existing topics
EXISTING_TOPICS=$(docker exec -it jp-kafka-1 /opt/kafka/bin/kafka-topics.sh --list --bootstrap-server $BROKER)
for TOPIC in $EXISTING_TOPICS; do
  docker exec -it jp-kafka-1 /opt/kafka/bin/kafka-topics.sh --delete --topic $TOPIC --bootstrap-server $BROKER
  echo "Deleted topic '$TOPIC'."
done

# Add topics from the array
for TOPIC in "${TOPICS[@]}"; do
  docker exec -it jp-kafka-1 /opt/kafka/bin/kafka-topics.sh --create --topic $TOPIC --bootstrap-server $BROKER --partitions 1 --replication-factor 1
  echo "Created topic '$TOPIC'."
done