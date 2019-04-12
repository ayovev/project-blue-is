#!/bin/bash

bash -c "mongoimport --verbose --host mongo --db ieen --collection passwordResets --file '/root/database/seeds/passwordResets.json' --jsonArray;";
