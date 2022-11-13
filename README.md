# Angular IndexedDB Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# IndexedDB

IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. This API uses indexes to enable high-performance searches of this data. IndexedDB is a transactional database system, like an SQL-based RDBMS. However, unlike SQL-based RDBMSes, which use fixed-column tables, IndexedDB is a JavaScript-based object-oriented database. IndexedDB lets you store and retrieve objects that are indexed with a key; any objects supported by the structured clone algorithm can be stored. You need to specify the database schema, open a connection to your database, and then retrieve and update data within a series of transactions.

## Database related operations:

```ts
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
```

![1](https://github.com/arjunkhetia/Angular-IndexedDB-Project/blob/main/src/assets/1.png "1")

![2](https://github.com/arjunkhetia/Angular-IndexedDB-Project/blob/main/src/assets/2.png "2")


## ObjectStore (Table) related operations:

```ts
  createTable = (dbName: string, dbVersion: number, tableName: string, primaryKey: string, tableData: any) => new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = (event: any) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
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
```

![3](https://github.com/arjunkhetia/Angular-IndexedDB-Project/blob/main/src/assets/3.png "3")


## Record (Data) related operations:

```ts
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
```

![4](https://github.com/arjunkhetia/Angular-IndexedDB-Project/blob/main/src/assets/4.png "4")

![5](https://github.com/arjunkhetia/Angular-IndexedDB-Project/blob/main/src/assets/5.png "5")


## IndexedDB GUI (Chrome dev tools)

![6](https://github.com/arjunkhetia/Angular-IndexedDB-Project/blob/main/src/assets/6.png "6")
