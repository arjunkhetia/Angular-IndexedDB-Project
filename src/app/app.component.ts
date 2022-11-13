import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IndexeddbService } from './services/indexeddb.service';
// import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Angular IndexedDB Project';
  deleteObj = '';
  deleteRef = '';
  dbname = '';
  dbversion = '';
  databaseList: any = [];
  selectedDatabase = 'select database';
  selectedDatabaseRecord = 'select database';
  selectedTableRecord = 'select table';
  tableName = '';
  primaryKey = '';
  tableData = [
    {
      fieldName: '',
      autoIncrement: 'should auto increment',
      unique: 'should be unique'
    }
  ];
  tableList: any = [];
  tableListRecord: any = [];
  recordList: any = [];
  recordData = [
    {
      recordName: '',
      recordValue: ''
    }
  ];
  showEditRecord = false;
  @ViewChild('closebutton') closeButton?: ElementRef;

  constructor(private indexedDBService: IndexeddbService) { }

  ngOnInit(): void {
      this.getDatabaseList();
  }

  createDatabase() {
    this.indexedDBService.createDatabase(this.dbname, parseInt(this.dbversion)).then(data => {
      this.dbname = '';
      this.dbversion = '';
      this.getDatabaseList();
    }).catch(error => {
      console.error(error);
    });
  }

  getDatabaseList() {
    this.indexedDBService.getDatabaseList().then(data => {
      this.databaseList = data;
    }).catch(error => {
      console.error(error);
    });
  }

  delete() {
    if (this.deleteObj === 'database') {
      this.indexedDBService.deleteDatabase(this.deleteRef).then(data => {
        this.getDatabaseList();
        let element: HTMLElement = this.closeButton?.nativeElement as HTMLElement;
        element.click();
      }).catch(error => {
        console.error(error);
      });
    } else if (this.deleteObj === 'table') {
      const db = this.databaseList.filter((db: any) => db.name === this.selectedDatabase)
      this.indexedDBService.deleteTable(this.selectedDatabase, db[0].version + 1, this.deleteRef).then(data => {
        this.getTableList();
        let element: HTMLElement = this.closeButton?.nativeElement as HTMLElement;
        element.click();
      }).catch(error => {
        console.error(error);
      });
    } else if (this.deleteObj === 'record') {
      this.indexedDBService.deleteRecord(this.selectedDatabaseRecord, this.selectedTableRecord, this.deleteRef).then(data => {
        this.getAllRecords();
        let element: HTMLElement = this.closeButton?.nativeElement as HTMLElement;
        element.click();
      }).catch(error => {
        console.error(error);
      });
    }
  }

  addRow() {
    if (this.selectedDatabase !== 'select database') {
      this.tableData.push({
        fieldName: '',
        autoIncrement: 'should auto increment',
        unique: 'should be unique'
      });
    }
  }

  createTable() {
    const db = this.databaseList.filter((db: any) => db.name === this.selectedDatabase)
    this.indexedDBService.createTable(this.selectedDatabase, db[0].version + 1, this.tableName, this.primaryKey, this.tableData).then(data => {
      this.selectedDatabase = 'select database';
      this.tableName = '';
      this.primaryKey = '';
      this.tableData = [
        {
          fieldName: '',
          autoIncrement: 'should auto increment',
          unique: 'should be unique'
        }
      ];
      this.getTableList();
    }).catch(error => {
      console.error(error);
    });
  }

  getTableList() {
    this.indexedDBService.getTableList(this.selectedDatabase).then(data => {
      this.tableList = data;
    }).catch(error => {
      console.error(error);
    });
  }

  getTableListRecord() {
    this.indexedDBService.getTableList(this.selectedDatabaseRecord).then(data => {
      this.tableListRecord = data;
    }).catch(error => {
      console.error(error);
    });
  }

  getAllRecords() {
    this.indexedDBService.getAllRecords(this.selectedDatabaseRecord, this.selectedTableRecord).then(data => {
      this.recordList = data;
    }).catch(error => {
      console.error(error);
    });
  }

  addRecord() {
    if (this.selectedDatabaseRecord !== 'select database' && this.selectedTableRecord !== 'select table') {
      this.recordData.push({
        recordName: '',
        recordValue: ''
      });
    }
  }

  createUpdateRecord() {
    if (this.showEditRecord) {
      let data: any = {};
      let id = '';
      this.recordData.forEach((element: any) => {
        if (element.recordName !== 'id') {
          data[element.recordName] = element.recordValue;
        } else {
          id = element.recordValue;
        }
      });
      this.indexedDBService.updateRecord(this.selectedDatabaseRecord, this.selectedTableRecord, id, data).then(data => {
        this.getAllRecords();
        this.recordData = [
          {
            recordName: '',
            recordValue: ''
          }
        ];
      }).catch(error => {
        console.error(error);
      });
    } else {
      let data: any = {};
      this.recordData.forEach((element: any) => {
        data[element.recordName] = element.recordValue;
      });
      this.indexedDBService.createRecord(this.selectedDatabaseRecord, this.selectedTableRecord, data).then(data => {
        this.getAllRecords();
        this.recordData = [
          {
            recordName: '',
            recordValue: ''
          }
        ];
      }).catch(error => {
        console.error(error);
      });
    }
  }

  editRecord(record: any) {
    this.showEditRecord = true;
    this.recordData.pop();
    for (var property in record) {
      if (record.hasOwnProperty(property)) {
        this.recordData.push({
          recordName: property,
          recordValue: record[property]
        });
      }
    }
  }

}
