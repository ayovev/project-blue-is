#!/bin/bash

bash -c "mongoimport --verbose --host mongo --db ieen --collection pricedata --file '/root/database/seeds/pricedata.json' --jsonArray;";
