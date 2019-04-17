#!/bin/bash

collectionName="passwordResets";
schema=`cat /root/database/schemas/passwordResets`;
validationLevel="strict";
validationAction="warn";

bash -c "mongo --verbose ieen --host mongo --eval 'db.createCollection( \"$collectionName\", {
  validator: { $schema },
  validationLevel: \"$validationLevel\",
  validationAction: \"$validationAction\"
})'";
