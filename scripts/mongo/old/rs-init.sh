#!/bin/bash

sleep 2h

#mongo --host mongo1:17017 <<EOF
#use admin
#
#db.createUser({
#  user: "root",
#  pwd: "root",
#  roles: [
#    {
#      role: "root",
#      db: "admin"
#    }
#  ]
#})
#db.createUser({
# user: "admin",
#  pwd: "admin",
#  roles: [
#    {
#      role: "userAdminAnyDatabase",
#      db: "admin"
#    }
#  ]
#})

#EOF
#
#mongo --host mongo1:17017 <<EOF
#use posts
#
#db.createUser({
#  user: "sn",
#  pwd: "password",
#  roles: [
#    {
#      role: "readWrite",
#      db: "posts"
#    }
#  ]
#})
#
#db.getUsers()
#EOF
#
#
#sleep 2h
