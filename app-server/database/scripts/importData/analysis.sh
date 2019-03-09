#!/bin/bash

bash -c "mongoimport --verbose --host mongo --db ieen --collection analysis --file '/root/database/seeds/analysis.json' --jsonArray";
