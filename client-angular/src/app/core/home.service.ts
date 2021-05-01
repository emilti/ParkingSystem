import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import AvailableSpaces from './models/AvailableSpaces';
import StaticData from './models/StaticData';

const BASE_URL = 'http://localhost:57740';
const HomePageStaticData = '/Parking/GetParkingStaticData'
const HomePageAvailableSpacesData = '/Parking/GetАvailableSpaces'
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  

  constructor(private http: HttpClient) { }

  getStaticData(): Observable<StaticData>{
    let arr = this.http.get<StaticData>(BASE_URL + HomePageStaticData);
    return arr;    
  }

  getAvailableSpaces(): Observable<AvailableSpaces>{
    return this.http.get<AvailableSpaces>(BASE_URL + HomePageAvailableSpacesData);
  }
}

