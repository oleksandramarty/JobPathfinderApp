#!/bin/bash

echo "Removing cache..."

# Connect to Redis server and remove all keys in the current database
redis-cli -c FLUSHDB

echo "Cache removed successfully"