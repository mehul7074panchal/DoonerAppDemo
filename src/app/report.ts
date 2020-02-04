import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { ApiService } from './service/api.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from "file-saver";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['DD-MM-YYYY']
},
display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
},
};
@Component({
  selector: 'report',
  styleUrls: ['report.css'],
  templateUrl: 'report.html',
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class Report implements OnInit {
  reportSearch: FormGroup;
  loading = false;
  submitted = false;
  Report_Data: ReportTableElement[]
  states
  cities
  countries
  filteredOptionsState: Observable<string[]>;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;
  public IsWait: boolean = false;
  public IsWait2: boolean = false;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private api: ApiService
    , private changeDetectorRefs: ChangeDetectorRef
    , private _snackBar: MatSnackBar) { }

  displayedColumns: string[] = ['select', 'ComputerNo', 'SrNo', 'Company', 'FullName', 'Address',  'Country', 'MobileNo', 'PanCard', 'TotalDonationAmount', 'action'];
  dataSource = new MatTableDataSource<ReportTableElement>(ele);
  selection = new SelectionModel<ReportTableElement["ComputerNo"]>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    this.reportSearch = this.formBuilder.group({
      Name: [''],
      Company: [''],
      MobileNo: [''],
      Reference: [''],
      SrNo: [''],
      ComputerNo: [],
      Pincode: [''],
      CityVillage: [''],
      State: [''],
      Country: [''],
      Amount:[0],
      FromDate: [''],
      ToDate: [''],
      IsArchive: [false]
    })

    
    this.api.getLocations().subscribe(resp => {

      this.states = resp["state_name"]
      this.cities = resp["city_name"]
      this.countries = resp["country_name"]

      this.filteredOptionsState = this.reportSearch.controls['State'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.states))
        );

      this.filteredOptionsCity = this.reportSearch.controls['CityVillage'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.cities))
        );

    /*   this.filteredOptionsCountry = this.reportSearch.controls['Country'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.countries))
        ); */

    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    // Process checkout data here
    this.api.SearchDonner(this.reportSearch.value).subscribe(resp => {
      this.IsWait = true
      if(resp){
      this.IsWait = false
      this.Report_Data = resp//JSON.parse();
      this.dataSource.data = this.Report_Data;
      }
     

    },
    err => {
      this.IsWait = false;
      this._snackBar.open("Somthing is going on kindly try again.", "", {
        duration: 8000,
      });
      console.error(err);
    });
    this.IsWait = false
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  private _filter(value: string, filter: string[]): string[] {

    const filterValue = value.toLowerCase();
    return filter.filter(location => location.toLowerCase().includes(filterValue));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row.ComputerNo));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ReportTableElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row.ComputerNo) ? 'deselect' : 'select'} row ${row.ComputerNo + 1}`;
  }
  onSubmit() {
    this.IsWait = true;
    debugger;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Process checkout data here
    this.api.SearchDonner(this.reportSearch.value).subscribe(resp => {
      this.Report_Data = resp//JSON.parse();
      this.dataSource.data = this.Report_Data;
      this.IsWait = false;
      this.selection.clear()
    },
    err => {
      this.IsWait = false;
      this._snackBar.open("Somthing is going on kindly try again.", "", {
        duration: 8000,
      });
      console.error(err);
    }
    );
  
    //console.warn('Your order has been submitted', this.reportSearch.value);
  }

  downloadReport(flg : boolean) {

    this.IsWait2 = true;

    if (this.selection.selected.length > 0) {

      this.api.downloadFile(this.selection.selected,flg).subscribe(
        data => {
          this.IsWait2 = false;
          var currentdate = new Date();
          var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
          saveAs(data, "/" + datetime + ".pdf");
        },
        err => {
          this.IsWait2 = false;
          this._snackBar.open("Problem while downloading the file.", "", {
            duration: 8000,
          });
          console.error(err);
        }

      );
    

    } else {
      this.IsWait2 = false;
      this._snackBar.open("Select atleast one option from table.", "", {
        duration: 8000,
      });
     
    }

  }
  downloadExcel(){

    this.IsWait2 = true;

    if (this.selection.selected.length > 0) {

      this.api.downloadExcel(this.selection.selected).subscribe(
        data => {
          this.IsWait2 = false;
          var currentdate = new Date();
          var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
          saveAs(data, "/" + datetime + ".xlsx");
        },
        err => {
          this.IsWait2 = false;
          this._snackBar.open("Problem while downloading the file.", "", {
            duration: 8000,
          });
          console.error(err);
        }

      );
    

    } else {
      this.IsWait2 = false;
      this._snackBar.open("Select atleast one option from table.", "", {
        duration: 8000,
      });
     
    }

  }
 /*  viewDonner(): void {
    //this.dialogRef.close();
    //this.routeParam.navigateByUrl('/home/'+donnerId);
  } */

  deleteReport(donnerDetail: any) {
    var r = confirm("Are You Sure?");
    if (r == false) {
      return
    }
    console.log(donnerDetail)
    this.api.deleteDonner(donnerDetail).subscribe(resp => {
      console.log(resp)
      if (resp) {
        let index: number = this.Report_Data.findIndex(d => d === donnerDetail);
        //Donation_Data
        this.Report_Data.splice(index, 1)
        this.dataSource.data = this.Report_Data//new MatTableDataSource<DonationDetail>(Donation_Data);
        this.dataSource._updateChangeSubscription()

      }
    })
  }
}

export interface ReportTableElement {
  ComputerNo: number;
  SrNo: string;
  FullName: string;
  Address: string;

 // City: string;
  //State: string;
  Country: string;
  MobileNo: string;
  PanCard: string;
  TotalDonationAmount: Number
  IsArchive: boolean
  Company: string
}

let ele: ReportTableElement[] = [
  //  {ComputerNo : 1110, SrNo : "22" ,FullName:"M1221ehul m Panchal",
  //   Address:"32/B saikrupa soc, k 32/B saikrupa soc,\nopp. aanandnagar Karelibaug 32/B saikrupa soc,\nopp. aanandnagar Karelibaug Dist: d Village: v Taluko: Vadodara Pincode: 39002 Area: jh",City:"Vadodara",State:"Gujarat",Country:"India",MobileNo:"6504007437",TotalDonationAmount:2000.0}
];

