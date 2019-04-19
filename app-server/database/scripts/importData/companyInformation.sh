#!/bin/bash

bash -c "mongoimport --verbose --host mongo --db ieen --collection companyInformation --file '/root/database/seeds/companyInformation.json' --jsonArray";
