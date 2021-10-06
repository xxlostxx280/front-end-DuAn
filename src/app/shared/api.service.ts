import { ErrorHandler, Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {map,catchError} from 'rxjs/operators'; 
import { Observable } from 'rxjs';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:HttpClient) { }
  getApi(url:any){
    return this.http.get('http://localhost:8080/' + url)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  postApi(url:any,data:any){
    return this.http.post('http://localhost:8080/' + url,data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
}
