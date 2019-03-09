#!/bin/bash

collectionName="pricedata";
schema=`cat /root/database/schemas/pricedata`;
validationLevel="strict";
validationAction="warn";

bash -c "mongo ieen --host mongo --eval 'db.createCollection( \"$collectionName\", {
  validator: { $schema },
  validationLevel: \"$validationLevel\",
  validationAction: \"$validationAction\"
})'";
