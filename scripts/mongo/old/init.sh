#!/bin/bash

echo "Check replica set status"
status=$(mongo --host mongo1:17017 /scripts/get-status.js | grep status | cut -d ":" -f2 | xargs);

if [ "$status" -ne "0" ]
then
  exit 0
fi

delay=30s
echo "Init replica set"
mongo --host mongo1:17017 /scripts/init.js
echo "****** Waiting for $delay seconds for replicaset configuration to be applied ******"
sleep $delay



