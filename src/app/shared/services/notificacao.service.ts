import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_NOTIFICACAO = '/api/v1/notificacao';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  
  constructor(private http: HttpClient){

  }

  loadNotificacoes(): Observable<any[]>{
    return this.http.get(`${environment.URL_API}${URL_NOTIFICACAO}/`)
    .pipe(map((resp: any[]) => {
      return resp;
    }));
  }

  save(data): Observable<any>{
    return this.http.post(`${environment.URL_API}${URL_NOTIFICACAO}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  update(data): Observable<any>{
    return this.http.put(`${environment.URL_API}${URL_NOTIFICACAO}/${data.id}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  modelUpload(formData): any {
    this.http.post(`${environment.URL_API}${URL_NOTIFICACAO}/upload`, formData, {reportProgress: true, observe: 'events'})
        .subscribe({
          next: (event) => {
          console.log(event);
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }
}
