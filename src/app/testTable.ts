import {Component, OnInit, Inject, ViewChild} from '@angular/core'

export interface TestElement {
    r_no: string;
    date: string;
    amount: number;
    detail: string;
  }

  const ELEMENT_DATA: TestElement[] = [
    {r_no: "1234", date: '25-01-2018', amount: 1.0079, detail: 'Construction'},
    {r_no: "4567", date: '25-02-2018', amount: 4.0026, detail: 'Bhojan'},
    {r_no: "8901", date: '25-03-2018', amount: 6.941, detail: 'Grass For Cows'},
    {r_no: "2345", date: '25-04-2018', amount: 9.0122, detail: 'Education'},
    {r_no: "1010", date: '25-05-2018', amount: 10.811, detail: 'Construction'},
    {r_no: "2939", date: '25-06-2018', amount: 12.0107, detail: 'Bhojan'},
    {r_no: "4949", date: '25-07-2018', amount: 14.0067, detail: 'Grass For Cows'},
    {r_no: "9087", date: '25-08-2018', amount: 15.9994, detail: 'Education'},
    {r_no: "4545", date: '25-09-2018', amount: 18.9984, detail: 'Construction'},
    {r_no: "1616", date: '25-10-2018', amount: 20.1797, detail: 'Bhojan'},
  ];
  
  /**
   * @title Basic use of `<table mat-table>`
   */
  @Component({
    selector: 'testTable',
    styleUrls: ['testTable.css'],
    templateUrl: 'testTable.html',
  })

  export class TestTable {
    displayedColumns: string[] = ['r_no', 'date', 'amount', 'detail'];
    dataSource = ELEMENT_DATA;
  }