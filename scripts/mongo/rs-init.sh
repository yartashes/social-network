#!/bin/bash

sleep 15s

mongo --host mongo1:17017 <<EOF
let config = {
  "_id": "sn",
  "version": 1,
  "members": [
    {
      "_id": 1,
      "host": "mongo1:17017",
      "priority": 2
    },
    {
      "_id": 2,
      "host": "mongo2:17018",
      "priority": 1
    }
  ]
};
rs.initiate(config, { force: true });
EOF

mongo --host mongo1:17017 <<EOF
use posts;
EOF

echo "****** Waiting for ${DELAY} seconds for replicaset configuration to be applied ******"

sleep 30s

mongo --host mongo1:17017 <<EOF
use admin

db.createUser({
  user: "root",
  pwd: "root",
  roles: [
    {
      role: "root",
      db: "admin"
    }
  ]
})
db.createUser({
 user: "admin",
  pwd: "admin",
  roles: [
    {
      role: "userAdminAnyDatabase",
      db: "admin"
    }
  ]
})

use posts
db.createUser({
  user: "sn",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "posts"
    }
  ]
})
EOF


sleep 30m
