import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_LOGISTICS = '/api/v1/logistics';

@Injectable({
  providedIn: 'root'
})
export class LogisticsService {
  
  constructor(private http: HttpClient){

  }

  getByDate(data: Date): Observable<any[]>{

  const dataFormatada = data.toISOString().split('T')[0];
    console.log(dataFormatada)

    return this.http.get(`${environment.URL_API}${URL_LOGISTICS}/date?data=${dataFormatada}`)
    .pipe(map((resp: any[]) => {
      return resp;
    }));
  }

  save(data): Observable<any>{
    debugger
    return this.http.post(`${environment.URL_API}${URL_LOGISTICS}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  update(data): Observable<any>{
    return this.http.put(`${environment.URL_API}${URL_LOGISTICS}/${data.id}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  modelUpload(formData): any {
    this.http.post(`${environment.URL_API}${URL_LOGISTICS}/upload`, formData, {reportProgress: true, observe: 'events'})
        .subscribe({
          next: (event) => {
          console.log(event);
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }
}
