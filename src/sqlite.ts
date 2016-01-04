/// <reference path="../typings/sqlite3/sqlite3.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

import sqlite3 = require('sqlite3');
import fs = require('fs');
import _ = require('underscore');

export class Sqlite<T> {
  public db: sqlite3.Database;
  private pkg: any;
  private table: string;
  
  constructor(createCmd: string, public map: (row: any) => T, callback?: (error: any) => void, filePath?: string) {
    this.pkg = JSON.parse(fs.readFileSync('./package.json', 'UTF-8'));
    if (filePath === undefined) {
      filePath = this.pkg.databasePath;
    }
    
    var m: RegExpExecArray;
    var re = /TABLE (IF NOT EXISTS)? ?(\w*)/i;
    if ((m = re.exec(createCmd)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        this.table = _.last(m);
    }
    
    this.db = new sqlite3.Database(filePath);
    this.db.exec(createCmd, callback);
  }

  close(callback?: (error: Error) => void) {
    this.db.close(callback);
  }

  insert(cmd: string, params: any[], callback: (error: Error) => void) {
    this.db.run(cmd, params, callback);
  }
  
  delete(cmd: string, params: any[], callback: (error: Error) => void) {
    this.db.run(cmd, params, callback);
  }

  where(select: string, params: any[], callback: (error: Error, elements: T[]) => void) {
    var _this = this;
    this.db.all(select, params, function(error: Error, rows: any[]) {
      if (error === null && rows !== undefined) {
        var elements: T[] = [];
        rows.forEach(element => {
          elements.push(_this.map(element));
        });
        callback(error, elements);
      } else {
        callback(error, null);
      }
    });
  }
  
  all(callback: (error: Error, elements: T[]) => void) {
    var _this = this;
    this.db.all('SELECT * FROM ' + this.table, function(error: Error, rows: any[]) {
      if (error === null && rows !== undefined) {
        var elements: T[] = [];
        rows.forEach(element => {
          elements.push(_this.map(element));
        });
        callback(error, elements);
      } else {
        callback(error, null);
      }
    });
  }

  get(select: string, params: any[], callback: (error: Error, element: T) => void) {
    var _this = this;
    this.db.get(select, params, function(error: Error, row: any) {
      if (error === null && row !== undefined) {
        callback(error, _this.map(row));
      } else {
        callback(error, null);
      }
    });
  }
}
