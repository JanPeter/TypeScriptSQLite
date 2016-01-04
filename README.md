# TypeScript SQLite Wrapper (Object Relation Mapper)

Use this package to use sqlite commands in a generic way. The package automatically creates your database, you just need to specify the create table command. You can specify the file name of the database file via your package.json or in the constructor as the last parameter.

## Installation

Install this package either via [npm](https://www.npmjs.com/) or the [TypeScript Module Manager (tsmm)](https://www.npmjs.com/package/tsmm).

npm:

    npm install tssqlite --save

TypeScript Module Manager (tsmm):

    tsmm install https://github.com/JanPeter/TypeScriptSQLite.git

## API

    class Sqlite<T>

### Constructor

You need to provide either the filePath parameter in the constructor or you can use the databasePath key in your package.json like that:

    {
      "name": "yourpackagename",
      "databasePath": "yourdatabasefile.db"
      ...
    }

Without one of this options, the package will not be able to create your database. If you didn't provide one of this, your callback will get an Error with the message `no databasePath provided`.

**constructor(createCmd: string, map: (row: any) => T, callback?: (error: Error) => void, filePath?: string)**

* `createCommand` string, the create table command (I highly recommend to use CREATE TABLE IF NOT EXISTS...)
* `map` function(row: any) => T, used to map the database row to your object of your class T
    * `row` any, database row object (access with row["colname"] or row.colname)
* `callback` optional function, called when the database and the table is created
    * `error` Error
* `filePath` optional string, location of your database file (will be created if not exists)

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      });

### All

**all(callback: (error: Error, elements: T[])**

* `callback` function will be called after execution of `all` function
    * `error` Error
    * `elements` T[], list of all objects from table

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      }, function(error: Error) {
        if (error === null) {
          database.all(function(error: Error, users: User[]) {
            if (error === null) {
              console.log(users);
            } else {
              console.log(error);
            }
          }
        } else {
          console.log(error);
        }
      });

### Where

**where(select: string, params: any[], callback: (error: Error, elements: T[]) => void)**

* `select` string, sql select command
* `params` any[], values to be inserted in the where clause
* `callback` function will be called after `where` function is executed
    * `error` Error
    * `elements` T[], list of selected objects

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      }, function(error: Error) {
        if (error === null) {
          database.where('SELECT * FROM user WHERE name = ?', ['karl'], function(error: Error, users: User[]) {
            if (error === null) {
              console.log(users);
            } else {
              console.log(error);
            }
          }
        } else {
          console.log(error);
        }
      });
      
### Get

**get(select: string, params: any[], callback: (error: Error, element: T) => void)**

* `select` string, sql select command
* `params` any[], values to be inserted in the where clause
* `callback` function will be called after `where` function is executed
    * `error` Error
    * `element` T, first selected object

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      }, function(error: Error) {
        if (error === null) {
          database.get('SELECT * FROM user WHERE name = ?', ['karl'], function(error: Error, user: User) {
            if (error === null) {
              console.log(user);
            } else {
              console.log(error);
            }
          }
        } else {
          console.log(error);
        }
      });

### Insert

**insert(cmd: string, params: any[], callback: (error: Error) => void)**

* `cmd` string, sql insert command
* `params` any[], values to be inserted
* `callback` function will be called after insert command is executed
    * `error` Error

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      }, function(error: Error) {
        if (error === null) {
          database.insert('INSERT INTO user (name) VALUES (?)', ['karl'], function(error: Error) {
            if (error === null) {
              console.log('successfully inserted karl');
            } else {
              console.log(error);
            }
          }
        } else {
          console.log(error);
        }
      });

### Delete

**delete(cmd: string, params: any[], callback: (error: Error) => void)**

* `cmd` string, sql delete command
* `params` any[], values to be inserted in the where clause
* `callback` function will be called after delete command is executed
    * `error` Error

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      }, function(error: Error) {
        if (error === null) {
          database.insert('INSERT INTO user (name) VALUES (?)', ['karl'], function(error: Error) {
            if (error === null) {
              database.insert('DELETE FROM user WHERE name = ?)', ['karl'], function(error: Error) {
                if (error === null) {
                  console.log('successfully deleted karl');
                } else {
                  console.log(error);
                }
              }
            } else {
              console.log(error);
            }
          }
        } else {
          console.log(error);
        }
      });

### Close

You can explicitly close the database connection with this function.

**close(callback?: (error: Error) => void))**

* `callback` function will be called after database is closed
    * `error` Error

**Example (TypeScript)**

    import Sqlite = require('sqlite');

    class User {
      constructor(public id: number, public name: string) { }
    }

    var database = new Sqlite<User>('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)',
      (row) => {
        return new User(row.id, row.name);
      }, function(error: Error) {
        if (error === null) {
          database.close(function(error: Error) {
            if (error === null) {
              // Any further executed functions to the database object won't work now
              database.all(function(error: Error, users: User[]) {
                // error object should not be null now
              });
            } else {
              console.log(error); 
            }
          });
        } else {
          console.log(error);
        }
      });