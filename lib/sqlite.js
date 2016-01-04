/// <reference path="../typings/tsd.d.ts" />
var sqlite3 = require('sqlite3');
var fs = require('fs');
var _ = require('underscore');
var Sqlite = (function () {
    function Sqlite(createCmd, map, callback, filePath) {
        this.map = map;
        this.pkg = JSON.parse(fs.readFileSync('./package.json', 'UTF-8'));
        if (filePath === undefined) {
            filePath = this.pkg.databasePath;
        }
        var m;
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
    Sqlite.prototype.close = function (callback) {
        this.db.close(callback);
    };
    Sqlite.prototype.insert = function (cmd, params, callback) {
        this.db.run(cmd, params, callback);
    };
    Sqlite.prototype.delete = function (cmd, params, callback) {
        this.db.run(cmd, params, callback);
    };
    Sqlite.prototype.where = function (select, params, callback) {
        var _this = this;
        this.db.all(select, params, function (error, rows) {
            if (error === null && rows !== undefined) {
                var elements = [];
                rows.forEach(function (element) {
                    elements.push(_this.map(element));
                });
                callback(error, elements);
            }
            else {
                callback(error, null);
            }
        });
    };
    Sqlite.prototype.all = function (callback) {
        var _this = this;
        this.db.all('SELECT * FROM ' + this.table, function (error, rows) {
            if (error === null && rows !== undefined) {
                var elements = [];
                rows.forEach(function (element) {
                    elements.push(_this.map(element));
                });
                callback(error, elements);
            }
            else {
                callback(error, null);
            }
        });
    };
    Sqlite.prototype.get = function (select, params, callback) {
        var _this = this;
        this.db.get(select, params, function (error, row) {
            if (error === null && row !== undefined) {
                callback(error, _this.map(row));
            }
            else {
                callback(error, null);
            }
        });
    };
    return Sqlite;
})();
module.exports = Sqlite;
