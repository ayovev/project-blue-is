#!/bin/bash

bash -c "mongoimport --verbose --host mongo --db ieen --collection users --file '/root/database/seeds/users.json' --jsonArray;";
