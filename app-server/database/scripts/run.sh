#!/bin/bash

bash -c "
./root/database/scripts/miscellaneous/dropDatabase.sh;

./root/database/scripts/createCollection/analysis.sh;
./root/database/scripts/createCollection/companyInformation.sh;
./root/database/scripts/createCollection/passwordResets.sh;
./root/database/scripts/createCollection/pricedata.sh;
./root/database/scripts/createCollection/users.sh;

./root/database/scripts/importData/analysis.sh;
./root/database/scripts/importData/passwordResets.sh;
./root/database/scripts/importData/pricedata.sh;
./root/database/scripts/importData/users.sh;
";
