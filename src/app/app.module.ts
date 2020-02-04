import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  FormsModule
  , ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common'
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter'

import { MatSnackBarModule } from '@angular/material/snack-bar';


import {
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatListModule,
  MatToolbarModule,
  MatExpansionModule,
  MatRadioModule,
  MatDialogModule,
  MatTabsModule,
  MatGridListModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule
} from '@angular/material'
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './service/api.service';
import { HomeComponent, homeFilterDialog, AddNewDonationDialog } from './home.component'
import { TestTable } from './testTable'
import { Report } from './report'
import { ChartComponent } from './chart.component'
import { RootComponent } from './root.component'
import { NavComponent } from './nav.component'
import { AppComponent } from './app.component';

const routes = [
  { path: '', component: RootComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:donnerId', component: HomeComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'report', component: Report }

]

@NgModule({
  declarations: [
    AppComponent, HomeComponent, homeFilterDialog, TestTable, Report, 
    AddNewDonationDialog, RootComponent, NavComponent,
    ChartComponent
  ],
  entryComponents: [HomeComponent, homeFilterDialog, TestTable, Report, AddNewDonationDialog],

  imports: [
    BrowserModule, BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatGridListModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],

  providers: [ApiService,DatePipe, {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},],
  bootstrap: [AppComponent]
})
export class AppModule { }
