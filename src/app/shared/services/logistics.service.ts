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
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    
    const dataFormatada = `${ano}-${mes}-${dia}`;
    
    return this.http.get(`${environment.URL_API}${URL_LOGISTICS}/date?data=${dataFormatada}`)
    .pipe(map((resp: any[]) => {
      return resp;
    }));
  }
  
  save(data): Observable<any>{
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

  updateDriver(data): Observable<any>{
    
    return this.http.put(`${environment.URL_API}${URL_LOGISTICS}/atualizar-motorista/${data.id}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

   updateObservacao(data): Observable<any>{
    
    return this.http.put(`${environment.URL_API}${URL_LOGISTICS}/atualizar-observacao/${data.id}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  updateDataLog(data): Observable<any>{
    
    return this.http.put(`${environment.URL_API}${URL_LOGISTICS}/atualizar-data-logistica/${data.id}`,data)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }
  
  complete(id: string, concluido: boolean) {
    return this.http.put(`${environment.URL_API}${URL_LOGISTICS}/${id}/complete`, concluido)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  uncomplete(id: string, concluido: boolean) {
    return this.http.put(`${environment.URL_API}${URL_LOGISTICS}/${id}/uncomplete`, concluido)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }
}
