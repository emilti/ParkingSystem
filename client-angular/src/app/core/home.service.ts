import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import StaticData from './models/StaticData';

const BASE_URL = 'http://localhost:57740';
const HomePageStaticData = '/Parking/GetParkingStaticData'
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  

  constructor(private http: HttpClient) { }

  getStaticData(): Observable<StaticData>{
    let arr = this.http.get<StaticData>(BASE_URL + HomePageStaticData);
    return arr;    
  }
}

