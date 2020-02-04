import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs'
import { ReportTableElement } from '../report';
import { DonationDetail } from '../home.component';
import { Router } from '@angular/router';
import { Data } from '../chart.component';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUri: string = 'https://192.168.0.107:44352/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  _httpClient: any;

  constructor(private http: HttpClient,private router: Router) { }

  postDonner(donnerDetail: any) {

   return this.http.post(this.baseUri + '/donner/postDonner', donnerDetail)
  }

  postDonation(donationDetail: any) : any {

    return this.http.post(this.baseUri + '/donation/postDonation', donationDetail);

  }

  putDonner(donnerDetail: any,donnerId:number) {
   
      return this.http.put(this.baseUri + '/donner/putDonner/'+donnerId, donnerDetail)
     }

     putDonation(donationDetail: any,donationDetailId:number) {
   
      return this.http.put(this.baseUri + '/donation/putDonation/'+donationDetailId, donationDetail)
     }


  deleteDonation(donationDetail: any) {
    console.log(donationDetail)
  return this.http.put(this.baseUri + '/donation/DeleteDonation/' + donationDetail.donationDetailID, donationDetail)
  }

  deleteDonner(donnerDetail: any) {
    console.log(donnerDetail)
   return this.http.put(this.baseUri + '/donner/deleteDonner/' + donnerDetail.ComputerNo, donnerDetail)
  }

  getLocations() {

    return this.http.get(this.baseUri + '/donner/locations')
  }

  downloadFile(ids : any, flg : boolean) {
    var body = { filename: "/my.pdf" };
    return this.http.post(this.baseUri + '/donner/Export?ids='+ids+'&flg='+flg, body, 
    {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  downloadExcel(ids : any) {
    var body = { filename: "/my.xlsx" };
    return this.http.post(this.baseUri + '/donner/ExportCSV?ids='+ids, body, 
    {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }
  getDonnerByID(donnerDetailID: number,isarchive : boolean) {

    return this.http.get(this.baseUri + '/donner/' + donnerDetailID + "?isarchive=" + isarchive)
  }

  getDonationByDonner(donnerDetailID: number): Observable<DonationDetail[]> {

    return this.http.get<DonationDetail[]>(this.baseUri + '/donation/getDonationByDonner/' + donnerDetailID)
  }

  SearchDonner(DonnerDTO: any): Observable<ReportTableElement[]> {


    return this.http.post<ReportTableElement[]>(this.baseUri + '/donner/search', DonnerDTO)
  }


  postChart(chart: any): Observable<Data[]> {

    return this.http.post<Data[]>(this.baseUri + '/donation/chart/',chart)
  }
}
