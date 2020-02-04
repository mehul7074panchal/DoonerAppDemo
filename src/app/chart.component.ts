import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from './service/api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html'
})

export class ChartComponent implements OnInit {
  
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  public myChart: Chart
  constructor(
    private api: ApiService,
    private routeParam: Router, private formBuilder: FormBuilder) {
  }

  formChart: FormGroup;
  yearfc = new FormControl('', [Validators.required]);
  quarterfc = new FormControl('', [Validators.required]);
  data: Data[];

  ///first chat:- Yearly Bar Chart of Donation
  Value1 = [];
  Value2 = [];
  barchart1 = [];

  public ch1_yearly:String = "Yearly";

  chart_type = "bar";

  
  mode: string;
  //types: string[] = ['Overall Donation', 'Donation By Type', 'Donation By Cities', 'Top Donners'];
  modes: Mode[] = [
    { value: '1', Mode: 'Overall Donation' },
    { value: '2', Mode: 'Donation By Type' },
   /*  { value: '3', Mode: 'Donation By Cities' }, */
    { value: '4', Mode: 'Top Donners' },
   
  ];


  chartType : string
  chartTypes: ChartType[] = [
    { value: '1', viewValue: 'Yearly' },
    { value: '2', viewValue: 'Monthly' },
    { value: '3', viewValue: 'Quarterly' }
  ];
  year : string
//"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  months:  Month[] = [
    { value: '1', Month: 'January' },
    { value: '2', Month: 'February' },
    { value: '3', Month: 'March' },
    { value: '4', Month: 'April' },
    { value: '5', Month: 'May' },
    { value: '6', Month: 'June' },
    { value: '7', Month: 'July' },
    { value: '8', Month: 'August' },
    { value: '9', Month: 'September' },
    { value: '10', Month: 'October' },
    { value: '11', Month: 'November' },
    { value: '12', Month: 'December' }
    
   
  ]
month : string

quarter : string
quarters: Quarter[] = [
  { value: '1', Quarter: 'Quarter-1' },
  { value: '2', Quarter: 'Quarter-2' },
  { value: '3', Quarter: 'Quarter-3' },
  { value: '4', Quarter: 'Quarter-4' }
 
];

city = new FormControl();

public IsMonth: boolean = false;
//public IsCity: boolean = false;
public IsYear: boolean = false;
public IsQuarter: boolean = false;

  ngOnInit() {

   /*  this.api.getLocations().subscribe(resp => {
     
      this.cities = resp["city_name"]
    
      

      this.filteredOptionsCity = this.city['City'].valueChanges
        .pipe(
          startWith(''),
          map(city => this._filter(city, this.cities))
        );

     

    })
 */
    this.mode =  this.modes[0].value

    this.chartType = '1'
    this.year = new Date().getFullYear()+""

    this.chart1_func("","","","",11,"bar");
   
  }

  onTypeChange(){
    this.year = "";
    this.month = "";
    this.quarter = "";
 //   this.cities = "";

    if(this.chartType ==  '1'){
      this.IsMonth = false
      this.IsQuarter = false
      if(this.mode == '1'){
       
      
        this.IsYear = false
        //this.IsCity = false
    

      }else if(this.mode == '2' || this.mode == '4'){
       
       
      
        this.IsYear = true
      //  this.IsCity = false
        if(this.mode == '2'){
        

        }
        if(this.mode == '4'){
         
        }
      
      }else if(this.mode == '3'){
       
       
       
        this.IsYear = true
     //   this.IsCity = true
      
      }
      
    }else  if(this.chartType ==  '2'){
      this.IsYear = true
      this.IsQuarter = false
      if(this.mode == '1'){
       
        this.IsMonth = false
        
      //  this.IsCity = false
       

      }else if(this.mode == '2' || this.mode == '4'){
       
        this.IsMonth = true
        this.IsYear = true
        //this.IsCity = false
        if(this.mode == '2'){
       

        }
        if(this.mode == '4'){
         

        }
      
      }else if(this.mode == '3'){
       
        this.IsMonth = true
        this.IsYear = true
    //    this.IsCity = true
      
      }
      
    }else  if(this.chartType ==  '3'){
     
      this.IsYear = true
      this.IsMonth = false
      if(this.mode == '1'){
       
      
        this.IsQuarter = false
     //   this.IsCity = false
     

      }else if(this.mode == '2' || this.mode == '4'){
       
        this.IsQuarter = true
      //  this.IsCity = false
        if(this.mode == '2'){
        

        }
        if(this.mode == '4'){
         
        }
      
      }else if(this.mode == '3'){
       
        this.IsQuarter = true
     //   this.IsCity = true
       
      
      }
      
    }
  }

  onModeChange(){
    this.year = "";
    this.month = "";
    this.quarter = "";
    if(this.mode ==  '1'){

      this.IsMonth = false
      this.IsQuarter = false
    //  this.IsCity = false
       
      if(this.chartType == '1'){
       
      
        this.IsYear = false
       

      }else if(this.chartType == '2' || this.chartType == '3'){
       
       
        this.IsYear = true
       
      
      }
      
    }
    else  if(this.mode ==  '2' || this.mode ==  '4'){
      this.IsYear = true
     // this.IsCity = false
      if(this.chartType == '1'){
       
        this.IsMonth = false
        
        this.IsQuarter = false
       
       

      }else if(this.chartType == '2'){
       
        this.IsMonth = true
        this.IsQuarter = false
       
      
      }else if(this.chartType == '3'){
       
        this.IsMonth = false
        this.IsQuarter = true
      
      
      }
      
    }
    else  if(this.mode ==  '3'){
     
      this.IsYear = true
     // this.IsCity = true
    
      if(this.chartType == '1'){
       
      
        this.IsQuarter = false
        this.IsMonth = false
       

      }else if(this.chartType == '2'){
       
        this.IsQuarter = false
        this.IsMonth = true
      
      }else if(this.chartType == '3'){
       
        this.IsQuarter = true
        this.IsMonth = false
      
      }
      
    }
   
  }
  getData(){

    var chart_name 
    if(this.mode == '1' || this.mode == '4'){
        chart_name = "bar"
    }
    if(this.mode == '2' || this.mode == '3'){
      chart_name = "pie"
  }
    this.chart1_func(this.year,"",this.month,this.quarter,+(this.mode+""+this.chartType),chart_name)
  }
  chart1_func(year : string, city : string, month : string,quarter: string, mode : number , chart_name : string) {
     this.api.postChart({ Year: year, City: "", Month: month, QUARTER: quarter, Mode: mode })
     .subscribe((result: Data[]) => {
      this.Value1 =[]
      this.Value2 =[]
    result.forEach(x => {
      
      this.Value1.push(x.Value1);
      this.Value2.push(x.Value2);
    });
   
  //  this.canvas.nativeElement.destroy()
   // this.canvas.nativeElement.display()
   if (this.myChart) this.myChart.destroy(); 
    this.myChart = new Chart('canvas', {
      type: chart_name,
      data: {
        labels: this.Value1,

        datasets: [
          {
            data: this.Value2,
            borderColor: '#3cb371',
            backgroundColor: [
              "#3cb371",
              "#0000FF",
              "#9966FF",
              "#4C4CFF",
              "#00FFFF",
              "#f990a7",
              "#aad2ed",
              "#FF00FF",
              "Blue",
              "Red",
              "Blue"
            ],
          }
        ]
      },
      options: {
        legend: {
          display: chart_name == 'bar'? false : true
        },
        scales: {
          xAxes: [{
            display: true
            
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
     });
  }



  private _filter(value: any, filter: string[]): string[] {
    const filterValue = value.toLowerCase();

    return filter.filter(location => location.toLowerCase().includes(filterValue));
  }
}
export class Data {
  Value1: string;
  Value2: string;
}

export interface ChartType {
  value: string;
  viewValue: string;
}

export interface Mode {
  value: string;
  Mode: string;
}

export interface Month {
  value: string;
  Month: string;
}

export interface Quarter {
  value: string;
  Quarter: string;
}