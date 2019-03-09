#!/bin/bash

collectionName="analysis";
schema=`cat /root/database/schemas/analysis`;
validationLevel="strict";
validationAction="warn";

bash -c "mongo ieen --host mongo --eval 'db.createCollection( \"$collectionName\", {
  validator: { $schema },
  validationLevel: \"$validationLevel\",
  validationAction: \"$validationAction\"
})'";
