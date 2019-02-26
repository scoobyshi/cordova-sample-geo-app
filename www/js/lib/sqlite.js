var db = null;
var databaseLocation = 'default';
var databaseName = 'test.db';
var tableName = 'SamplePreferences2';

function initDatabase() {
  db = window.sqlitePlugin.openDatabase({name: databaseName, location: databaseLocation});

  db.transaction(function(tr) {
    tr.executeSql('CREATE TABLE if not exists ' + tableName + '(' +
      'name text primary key, description, longitude, latitude, picture)');
  }, function(error) {
    console.log('Create Table Error:', error);
  }, function() {
    console.log('Created Table Ok');
  });
}

function clearTable() {
  db.transaction(function(tr) {
    tr.executeSql('delete from ' + tableName + ' where name = "default"');
  }, function(error) {
    console.log('Remove default record failed:', error);
  }, function() {
    console.log('Remove default record succeeded.');
  });
}

function addRecord(name,description,latitude,longitude,picture) {
  return new Promise((resolve, reject) => {
    // use replace instead
    db.transaction(function(tr) {
      tr.executeSql('REPLACE INTO ' + tableName + ' VALUES (?,?,?,?,?)', [name,description,latitude,longitude,picture]);
    }, function(error) {
      console.log('INSERT/UPDATE (Replace) error: ' + error.message);
      reject(error);
    }, function() {
      console.log('INSERT/UPDATE (Replace) OK');
      var response = {
        ok: true
      }
      resolve(response);
    });
  });
}

function getSqlResults() {
  return new Promise((resolve, reject) => {
    db.transaction(function(tr) {
      // tr.executeSql('SELECT upper(?) AS upperString', [data], function(ignored, resultSet) {
      tr.executeSql('SELECT description, picture from ' + tableName + ' where name = "default"', [], function(ignored, resultSet) {
        console.log('Query Succeeded.');
        resolve(resultSet);
      });
    }, function(error) {
      console.log('Query Failed:', error);
      reject(error);
    });
  });
}
