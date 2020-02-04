import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from './service/api.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportTableElement } from './report';
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateModule } from '@angular/material-moment-adapter';
import _moment from 'moment';
import { DatePipe } from '@angular/common'

import {MatDatepickerInputEvent} from '@angular/material/datepicker';


import {default as _rollupMoment} from 'moment';


export const MY_FORMATS = {
  parse: {
    dateInput: ['DD-MM-YYYY']
},
display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
},
};





export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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


export class HomeComponent implements OnInit {
  formSubmission: FormGroup;
  public IsWait: boolean = false;
  public IsWait2: boolean = false;
  submitted = false;
  public IsNewUser: boolean = false;
  dialogRefFilter


  displayedColumnsDonation = ['donationDate', 'donationDetailID', 'referenceNo', 'amount',
    'paymentMode', 'donationType', 'donationBy', 'remarks', 'action'];

  public NamePrefix: string[];


  dataSourceDonation = new MatTableDataSource<DonationDetail>(Donation_Data);
  states
  cities
  countries
  srNo
  filteredOptionsState: Observable<string[]>;
  filteredOptionsSrNo: Observable<string[]>;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;


  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
    private api: ApiService, private route: ActivatedRoute, private _snackBar: MatSnackBar
    , private routeParam: Router) {
  }

  animal: string;
  name: string;
  //dataSource = new MatTableDataSource(DONATION_DATA);

  @ViewChild(MatSort, { static: true }) sort11: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator11: MatPaginator;

  ngOnInit(): void {
    debugger;
    this.NamePrefix = ['SHRI', 'DR.', 'PROF.'];
    this.dataSourceDonation = new MatTableDataSource<DonationDetail>(Donation_Data);
    this.formSubmission = this.formBuilder.group({
      DonnerDetailID: [{disabled: true}],
      SrNo: ['', [Validators.required]],
      Company: [''],
      Title: [''],
      FirstName: [''],
      MiddleName: [''],
      Surname: [''],
      HouseNoName: [''],
      SocBuildingName: [''],
      Area: [''],
      PinCode: ['', [Validators.pattern('^[1-9][0-9]{5}$')]],
      Address1: [''],
      Address2: [''],
      CityVillage: [''],
      State: [''],
      Country: [''],
      //Village: [''],
      Taluko: [''],
      Dist: [''],
      MobileNo: ['', [Validators.pattern('[0-9]{10}$')]],
      PhoneNo: [''],
      Email: [''],
      Reference: [''],
      PanCard: ['',[Validators.pattern('^([A-Z]){5}([0-9]){4}([A-Z]){1}?$')]],
      AdharCard: ['',[Validators.pattern('[0-9]{12}$')]],
      IsArchive: [false]
    });

    this.formSubmission.controls['Country'].setValue("India");
    this.formSubmission.controls['State'].setValue("Gujarat");
   this.formSubmission.controls['DonnerDetailID'].disable();
    this.api.getLocations().subscribe(resp => {
      this.states = resp["state_name"]
      this.cities = resp["city_name"]
      this.countries = resp["country_name"]
      this.srNo= resp["code"]
     this.formSubmission.controls['DonnerDetailID'].setValue((resp["cur_id"]+1));
    
   
      this.filteredOptionsState = this.formSubmission.controls['State'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.states))
        );

      this.filteredOptionsCity = this.formSubmission.controls['CityVillage'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.cities))
        );


        this.filteredOptionsSrNo = this.formSubmission.controls['SrNo'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.srNo))
        );


        

     /*  this.filteredOptionsCountry = this.formSubmission.controls['Country'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.countries))
        ); */

    })
    this.dataSourceDonation.data = [];
    this.route.paramMap.subscribe(params => {
      console.log(params.get('donnerId'));
      if (params.get('donnerId')) {
        this.IsNewUser = true;

        var flgArch = this.route.snapshot.queryParamMap.get('isarchive')

        this.dataSourceDonation.sort = this.sort11;
        this.dataSourceDonation.paginator = this.paginator11;

        var isArchive = false
        console.log(isArchive)
        if (flgArch != null) {
          console.log(isArchive)
          isArchive = JSON.parse(this.route.snapshot.queryParamMap.get('isarchive'))
        }
        this.IsWait2 = true
        this.api.getDonnerByID(+params.get('donnerId'), isArchive).subscribe(res => {
          //debugger;
          this.IsWait2 = false

          console.log(res)
          this.formSubmission.setValue(
            res
          )
          //  this.dialogRef.
        }, err => {
          this.IsWait2 = false;
          this._snackBar.open("Somthing is going on kindly try again.", "", {
            duration: 8000,
          });
          console.error(err);
        })



        if (params.get('donnerId')) {
          this.api.getDonnerByID(+params.get('donnerId'), isArchive).subscribe(res => {
            //debugger;
            console.log(res)
            this.formSubmission.setValue(
              res
            )
            //  this.dialogRef.
          })

          this.api.getDonationByDonner(+params.get('donnerId')).subscribe(res => {
            //debugger;

            Donation_Data = res//JSON.parse();
            this.dataSourceDonation.data = Donation_Data;

          })
          //  this.dialogRefFilter.close()
        }



        // setTimeout(() => this.dataSourceDonation.paginator = this.paginator11);
      } else {
        this.dataSourceDonation.data = [];
        this.IsNewUser = false;

      }
      // this.orderObj = {...params.keys, ...params};
    });

  }

  onType(controlsName: any){
    var value = this.formSubmission.controls[controlsName].value;
    if(value.trim().length > 0){
     this.formSubmission.controls[controlsName].setValue(value+",")
    }else{
      this.formSubmission.controls[controlsName].setValue("")
    }
   
  }
  onTypeHypn(controlsName: any){
    var value = this.formSubmission.controls[controlsName].value;
    if(value.trim().length > 0){
     this.formSubmission.controls[controlsName].setValue(value+"-")
    }else{
      this.formSubmission.controls[controlsName].setValue("")
    }
  }

  keyPress() {
    debugger;
    // const pattern = /[0-9]/;
    // const inputChar = String.fromCharCode(event.charCode);

    // if (!pattern.test(inputChar)) {    
    //     // invalid character, prevent input
    //     event.preventDefault();
    // }
    return false;
  }
  
  applyFilter(filterValue: string) {
    this.dataSourceDonation.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceDonation.paginator) {
      this.dataSourceDonation.paginator.firstPage();
    }
  }
  deleteDonation(donationDetail: any) {
    console.log(donationDetail)
    var r = confirm("Are You Sure?");
    if (r == false) {
      return
    }
    this.api.deleteDonation(donationDetail).subscribe(resp => {
      console.log(resp)
      if (resp) {
        let index: number = Donation_Data.findIndex(d => d === donationDetail);
        //Donation_Data
        Donation_Data.splice(index, 1)
        this.dataSourceDonation.data = Donation_Data//new MatTableDataSource<DonationDetail>(Donation_Data);
        this.dataSourceDonation._updateChangeSubscription()

      } else {
        this.openSnackBar("Kidnly try again", "")
      }
    })
  }

  editDonation(donationDetail: DonationDetail) {
    debugger
    const dialogRefAddDonation = this.dialog.open(AddNewDonationDialog, {
      width: '550px',
      data: {
       DonationDetailID : donationDetail.donationDetailID, DonnerDetaildID: donationDetail.donnerDetaildID, ReferenceNo: donationDetail.referenceNo, Amount: donationDetail.amount, PaymentMode: donationDetail.paymentMode,
        DonationBy: donationDetail.donationBy, DonationType: donationDetail.donationType, DonationDate: donationDetail.donationDate, Remarks: donationDetail.remarks,dataSourceDonParam: this.dataSourceDonation
      }
    });

    dialogRefAddDonation.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  
  }
  get f() { return this.formSubmission.controls; }

  private _filter(value: string, filter: string[]): string[] {
    const filterValue = value.toLowerCase();

    return filter.filter(location => location.toLowerCase().includes(filterValue));
  }



  //ELEMENT_DATA;

  onSubmit() {

    var cmp = this.formSubmission.value["Company"];
    var fn = this.formSubmission.value["FirstName"];

    if(cmp.trim() != '' || fn.trim() != ''){
      if (this.formSubmission.valid) {
        this.IsWait = true;
        if (this.route.snapshot.paramMap.get('donnerId')) {
          this.api.putDonner(this.formSubmission.getRawValue(), +this.route.snapshot.paramMap.get('donnerId')).subscribe(
            (data) => {
              console.log(data)
              this.routeParam.navigate(['/home', data["donnerDetailID"]], { queryParams: { isarchive: data["isArchive"] } });
              this.openSnackBar("Data saved successfully", "-");
            },
            () => { this.openSnackBar("Kindly Try again.", "-"); });
          this.IsWait = false;
        } else {
          debugger
          this.api.postDonner(this.formSubmission.getRawValue()).subscribe(resp => {
            debugger;
            if (resp) {
              debugger
              this.routeParam.navigate(['/home', resp["donnerDetailID"]], { queryParams: { isarchive: resp["isArchive"] } });
              this.openSnackBar("Data saved successfully", "-");
            } else {
              this.openSnackBar("Kindly Try again.", "-");
            }
            this.IsWait = false;
            console.log(resp)
          });
        }
        console.log('Ok');
  
  
        //this._snackBar.dismiss();
  
      }
      else {
        this.openSnackBar("Please Enter all Required Fields", "-");
        console.log('Error');
      }
  
      console.warn('Your order has been submitted', this.formSubmission.value);

    }else{
      alert("Enter Name or Company");
    }
    //  this.dataSourceDonation.paginator = this.paginator;
   
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }


  //Donation Dialog related data
  DonnerDetaildID: number;
  ReferenceNo: string = "";
  Amount: number = 0;
  PaymentMode: string = "";
  DonationBy: string = "";
  DonationType: string = "";
  DonationDate: string;
  Remarks: string = "";

  openDialog(): void {
    const dialogRefAddDonation = this.dialog.open(AddNewDonationDialog, {
      width: '550px',
      data: {
        DonnerDetaildID: this.formSubmission.value["DonnerDetailID"], ReferenceNo: this.ReferenceNo, Amount: this.Amount, PaymentMode: this.PaymentMode,
        DonationBy: this.DonationBy, DonationType: this.DonationType, DonationDate: this.DonationDate, Remarks: this.Remarks, dataSourceDonParam: this.dataSourceDonation
      }
    });

    dialogRefAddDonation.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  openFilter(): void {
    this.dialogRefFilter = this.dialog.open(homeFilterDialog, {
      width: '900px',
      height: "90%",
      // data: {DonationDetailID: this.DonationDetailID, ReferenceNo: this.ReferenceNo, Amount: this.Amount, PaymentMode: this.PaymentMode,
      //   DonationBy:this.DonationBy, DonationType:this.DonationType, DoationDate:this.DoationDate, Remarks:this.Remarks}
    });

    this.dialogRefFilter.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}

let Donation_Data: DonationDetail[]
export interface DonationDetail {
  donationDetailID: number;
  donnerDetaildID: number;
  referenceNo: string;
  amount: number;
  paymentMode: string;
  donationType: string;
  donationBy: string;
  remarks: string;
  donationDate: string;
}

/* export interface DonnerFilter {
  computerNo: number;
  srNo: number;
  name: string;
  address: string;
  city: string;
  mobile: string;
}
 */
//let DONATION_DATA: DonationDetail[] = [];

@Component({
  selector: 'homeFilterDialog',
  templateUrl: './homeFilterDialog.html',
  styleUrls: ['./home.component.css']
})

export class homeFilterDialog implements OnInit {
  filterDialogSearch: FormGroup;

  states
  cities
  countries
  filteredOptionsState: Observable<string[]>;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsCountry: Observable<string[]>;

  public IsWait: boolean = false;

  @ViewChild(MatSort, { static: true }) sortFilter: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator1: MatPaginator;

  Report_Data: ReportTableElement[]
  displayedColumnsFilter = ['ComputerNo', 'SrNo', 'Company', 'FullName', 'Address', 'City', 'MobileNo', 'action'];
  dataSourceFilter = new MatTableDataSource<ReportTableElement>();

  constructor(
    public dialogRef: MatDialogRef<homeFilterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.filterDialogSearch = this.formBuilder.group({
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

    });

    this.api.getLocations().subscribe(resp => {

      this.states = resp["state_name"]
      this.cities = resp["city_name"]
      this.countries = resp["country_name"]

      this.filteredOptionsState = this.filterDialogSearch.controls['State'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.states))
        );

      this.filteredOptionsCity = this.filterDialogSearch.controls['CityVillage'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.cities))
        );

     /*  this.filteredOptionsCountry = this.filterDialogSearch.controls['Country'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, this.countries))
        ); */

    })


    this.dataSourceFilter.sort = this.sortFilter;
    this.dataSourceFilter.paginator = this.paginator1;
    this.IsWait = true;
    this.api.SearchDonner(this.filterDialogSearch.value).subscribe(resp => {
      this.IsWait = false;
      console.log(resp)
      this.Report_Data = resp
      this.dataSourceFilter.data = this.Report_Data;

    }, err => {
      this.IsWait = false;

      console.error(err);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSourceFilter.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceFilter.paginator) {
      this.dataSourceFilter.paginator.firstPage();
    }
  }
  onSubmit() {
    this.IsWait = true;
    this.api.SearchDonner(this.filterDialogSearch.value).subscribe(resp => {
      this.Report_Data = resp//JSON.parse();
      this.dataSourceFilter.data = this.Report_Data;
      this.IsWait = false;
    }
      ,
      err => {
        this.IsWait = false;

        console.error(err);
      });
  }

  private _filter(value: string, filter: string[]): string[] {
    const filterValue = value.toLowerCase();
    return filter.filter(location => location.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  viewDonner(): void {
    this.dialogRef.close();

    // this.routeParam.navigate(['/home/'+donner.ComputerNo],{ queryParams: { isarchive: donner.isArchive } });
    // this.route('/home/'+id);
  }
}

export interface AddDonationDialogData {
  DonationDetailID: number;
  DonnerDetaildID: string;
  ReferenceNo: string;
  Amount: number;
  PaymentMode: number;
  DonationBy: string;
  DonationType: string;
  DonationDate: Date;
  Remarks: string;
  Company: string
  dataSourceDonParam: MatTableDataSource<DonationDetail>
}

@Component({
  selector: 'addNewDonationDialog',
  styleUrls: ['./home.component.css'],
  templateUrl: './addNewDonationDialog.html',
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
  //templateUrl: './homeFilterDialog.html'
})


export class AddNewDonationDialog implements OnInit {

  public IsWait: boolean = false;


  doations: DonationType[] = [
    { value: 'FOR COWS', viewValue: 'FOR COWS' },
    { value: 'FOR FOOD', viewValue: 'FOR FOOD' },
    { value: 'GENERAL', viewValue: 'GENERAL' },
    { value: 'MEDICAL', viewValue: 'MEDICAL' },
    { value: 'EDUCATION', viewValue: 'EDUCATION' },
    { value: 'CONSTRUCTION', viewValue: 'CONSTRUCTION' },
    { value: 'DATTAK-LIFETIME', viewValue: 'DATTAK-LIFETIME' },
    { value: 'DATTAK-ANNUAL', viewValue: 'DATTAK-ANNUAL' },
    { value: 'CORPUS-GENERAL', viewValue: 'CORPUS-GENERAL' },
    { value: 'CORPUS-BTS', viewValue: 'CORPUS-BTS' },
    { value: 'CORPUS-BTM', viewValue: 'CORPUS-BTM' },
    { value: 'CORPUS-ASSETS', viewValue: 'CORPUS-ASSETS' }
  ];

  paymentModes: DonationType[] = [
    { value: 'CASH', viewValue: 'CASH' },
    { value: 'CHEQUE', viewValue: 'CHEQUE' },
    { value: 'ONLINE', viewValue: 'ONLINE' },
    { value: 'IN KIND', viewValue: 'IN KIND' }
  ];

  addDonation: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddNewDonationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddDonationDialogData,
    private formBuilder: FormBuilder, private api: ApiService
    , private _snackBar: MatSnackBar,public datepipe: DatePipe) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {

    console.log(this.data)
  debugger
    
      this.addDonation = this.formBuilder.group({
      DonationDetailID :[],
      DonnerDetaildID: [this.data.DonnerDetaildID],
      ReferenceNo: ['', [Validators.required]],
      DonationType: ['', [Validators.required]],
      DonationDate: ['', [Validators.required]],
      Amount: ['', [Validators.required, Validators.pattern('^\\d*(\\.\\d{0,2})?')]],
      PaymentMode: ['', [Validators.required]],
      DonationBy: [''],
      Remarks: ['']
    });
    if(this.data.DonationDetailID){
 
    
    
      this.addDonation.setValue(
        this.data
      )
    }
   
   

  }
 
  
  onAddDonation() {
    this.IsWait = true;

    if (this.addDonation.valid) {
      console.log('Ok');

     if(!this.addDonation.controls["DonationDetailID"].value){

      this.api.postDonation(this.addDonation.value).subscribe((resp: any) => {
        this.IsWait = false;
        if (resp) {
          console.log(resp)
          Donation_Data.unshift(resp)
       
          this.data.dataSourceDonParam.data = Donation_Data//new MatTableDataSource<DonationDetail>(Donation_Data);
          this.data.dataSourceDonParam._updateChangeSubscription()
          this.openSnackBar("Donation Added Successfully", "-");
        }
        else {
          this.openSnackBar("Error Occured", "-");
        }
        this._snackBar.dismiss();



      });
     }else{
      this.api.putDonation(this.addDonation.value,this.addDonation.controls["DonationDetailID"].value).subscribe((resp: any) => {
        this.IsWait = false;
        if (resp) {
          console.log(resp)
          let index: number = Donation_Data.findIndex(d => d.donationDetailID === this.addDonation.controls["DonationDetailID"].value);
          //Donation_Data
          Donation_Data.splice(index, 1,resp)
          debugger
          this.data.dataSourceDonParam.data = Donation_Data//new MatTableDataSource<DonationDetail>(Donation_Data);
          this.data.dataSourceDonParam._updateChangeSubscription()
          this.openSnackBar("Donation Updated Successfully", "-");
        }
        else {
          this.openSnackBar("Error Occured", "-");
        }
        this._snackBar.dismiss();



      });
     }
    
    }
    else {
      this.IsWait = false;
      console.log('Errro');
    }

  }

  openSnackBar(message: string, action: string) {

    //$('123')

    this._snackBar.open(message, action, {
      duration: 5000,
    });

    this.dialogRef.close();

  }
}

export interface DonationType {
  value: string;
  viewValue: string;
}