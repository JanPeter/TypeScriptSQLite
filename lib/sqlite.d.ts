/// <reference path="../typings/tsd.d.ts" />
import sqlite3 = require('sqlite3');
declare class Sqlite<T> {
    map: (row: any) => T;
    db: sqlite3.Database;
    private pkg;
    private table;
    constructor(createCmd: string, map: (row: any) => T, callback?: (error: Error) => void, filePath?: string);
    close(callback?: (error: Error) => void): void;
    insert(cmd: string, params: any[], callback: (error: Error) => void): void;
    delete(cmd: string, params: any[], callback: (error: Error) => void): void;
    where(select: string, params: any[], callback: (error: Error, elements: T[]) => void): void;
    all(callback: (error: Error, elements: T[]) => void): void;
    get(select: string, params: any[], callback: (error: Error, element: T) => void): void;
}
export = Sqlite;
