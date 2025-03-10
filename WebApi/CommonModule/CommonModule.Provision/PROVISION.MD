# Provision

#### Provisioning the environment
```shell
chmod +x provision.sh
./provision.sh
```
#### Drop db and apply migrations
```shell
chmod +x ./DataBaseScripts/drop_db.sh
./DataBaseScripts/drop_db.sh

chmod +x ./DataBaseScripts/apply_migration_microservice.sh
./DataBaseScripts/apply_migration_microservice.sh
```

#### Initialize db
```shell
chmod +x reinitialize_db.sh
./reinitialize_db.sh
```

#### Initialize db with test data
```shell
chmod +x reinitialize_db_data.sh
./reinitialize_db_data.sh
```