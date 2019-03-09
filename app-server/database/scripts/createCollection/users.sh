#!/bin/bash

collectionName="users";
schema=`cat /root/database/schemas/users`;
validationLevel="strict";
validationAction="warn";

bash -c "mongo ieen --host mongo --eval 'db.createCollection( \"$collectionName\", {
  validator: { $schema },
  validationLevel: \"$validationLevel\",
  validationAction: \"$validationAction\"
})'";
