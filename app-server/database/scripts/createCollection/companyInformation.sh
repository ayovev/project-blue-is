#!/bin/bash

collectionName="companyInformation";
schema=`cat /root/database/schemas/companyInformation`;
validationLevel="strict";
validationAction="warn";

bash -c "mongo --verbose ieen --host mongo --eval 'db.createCollection( \"$collectionName\", {
  validator: { $schema },
  validationLevel: \"$validationLevel\",
  validationAction: \"$validationAction\"
})'";
