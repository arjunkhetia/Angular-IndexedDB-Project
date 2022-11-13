import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  constructor() { }

  createDatabase = (dbName: string, dbVersion: number) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
  });

  getDatabaseList = () => new Promise((resolve, reject) => {
    indexedDB.databases().then(data => {
      resolve(data);
    }).catch(error => {
      reject(error);
    });
  });

  deleteDatabase = (dbName: string) => new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => {
      resolve("Deleted database successfully");
    };
    request.onerror = () => {
      reject("Couldn't delete database");
    };
    request.onblocked = () => {
      reject("Couldn't delete database due to the operation being blocked");
    };
  });

  createTable = (dbName: string, dbVersion: number, tableName: string, primaryKey: string, tableData: any) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    // This handler is called when a new version of the database
    // is created, either when one has not been created before
    // or when a new version number is submitted by calling
    // window.indexedDB.open().
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      let store: any;
      if (!db.objectStoreNames.contains(tableName)) {
        store = db.createObjectStore(tableName, {
          keyPath: primaryKey,
          autoIncrement: true,
        });
        tableData.forEach((data: any) => {
          if (data.fieldName) {
            store.createIndex(data.fieldName, data.fieldName, { autoIncrement: Boolean(data.autoIncrement), unique: Boolean(data.unique) });
          }
        });
        resolve(db);
      } else {
        reject("Duplicate table name");
      }
    };
  });

  getTableList = (dbName: string) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      resolve(event.target.result.objectStoreNames);
    };
  });

  deleteTable = (dbName: string, dbVersion: number, tableName: string) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      db.deleteObjectStore(tableName);
      resolve(db);
    };
  });

  createRecord = (dbName: string, tableName: string, recordData: any) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      store.put(recordData);
      transaction.oncomplete = function () {
        db.close();
        resolve(db);
      };
    };
  });

  getAllRecords = (dbName: string, tableName: string) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      const data = store.getAll();
      data.onsuccess = (res: any) => {
        resolve(res.target.result);
      };
    };
  });

  updateRecord = (dbName: string, tableName: string, recordId: any, recordData: any) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      const data = store.get(recordId);
      data.onsuccess = (res: any) => {
        const dbData = res.target.result;
        for (var property in recordData) {
          if (recordData.hasOwnProperty(property)) {
            dbData[property] = recordData[property]
          }
        }
        const requestUpdate = store.put(dbData);
        requestUpdate.onsuccess = (event: any) => {
          resolve(event.target.result);
        };
      };
    };
  });

  deleteRecord = (dbName: string, tableName: string, recordData: any) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);
      const data = store.delete(recordData);
      data.onsuccess = (res: any) => {
        resolve(res.target.result);
      };
    };
  });

}
