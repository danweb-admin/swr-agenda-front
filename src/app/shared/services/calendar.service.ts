import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Calendar } from '../models/calendar';

const URL_CALENDARS = '/api/v1/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  
  constructor(private http: HttpClient){

  }

  getCalendarByDay(date: string): Observable<Calendar[]>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/?date=${date}`)
    .pipe(map((resp: Calendar[]) => {
      return resp;
    }));
  }

  getCalendarByDayVisualizacao(date: string): Observable<Calendar[]>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/visualizacao?date=${date}`)
    .pipe(map((resp: Calendar[]) => {
      return resp;
    }));
  }

  getCalendarAll(date: string): Observable<Calendar[]>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/get-all/?date=${date}`)
    .pipe(map((resp: Calendar[]) => {
      return resp;
    }));
  }

  save(calendar: Calendar): Observable<Calendar>{
    return this.http.post(`${environment.URL_API}${URL_CALENDARS}`,calendar)
    .pipe(map((resp: Calendar) => {
      return resp;
    }));
  }

  update(calendar: Calendar): Observable<Calendar>{
    return this.http.put(`${environment.URL_API}${URL_CALENDARS}/${calendar.id}`,calendar)
    .pipe(map((resp: Calendar) => {
      return resp;
    }));
  }

  updateDriverOrTechniqueCalendar(personId: string, calendarId: string, isDriver: boolean, isCollect: boolean): Observable<Calendar> {
    let put = {
      personId,
      calendarId,
      isDriver,
      isCollect
    }
    return this.http.put(`${environment.URL_API}${URL_CALENDARS}/update-driver-or-technique-calendar`,put)
    .pipe(map((resp: Calendar) => {
      return resp;
    }))
  }

  updateStatusOrTravelOnCalendar(status: string, calendarId: string, isTravelOn: boolean, travelOn: string): Observable<Calendar> {
    let put = {
      status,
      calendarId,
      isTravelOn,
      travelOn
    }
    return this.http.put(`${environment.URL_API}${URL_CALENDARS}/update-status-or-travel-on-calendar`,put)
    .pipe(map((resp: Calendar) => {
      return resp;
    }))
  }

  updateContractMade(calendarId: string): Observable<Calendar>{
    let put = {
      calendarId,
    }
    return this.http.put(`${environment.URL_API}${URL_CALENDARS}/update-contract-made`,put)
    .pipe(map((resp: Calendar) => {
      return resp;
    }))
  }
  
  schedules(startDate: string, endDate: string, clientId: string, equipamentId: string, driverId: string, techniqueId: string, status: string): Observable<Calendar[]>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/schedules?startDate=${startDate}&endDate=${endDate}&clientId=${clientId}&equipamentList=${equipamentId}&driverList=${driverId}&techniqueId=${techniqueId}&status=${status}`)
    .pipe(map((resp: Calendar[]) => {
      return resp;
    }));
  }

  availability(month: string, year: string, equipamentId: string): Observable<any[]>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/availability?month=${month}&year=${year}&equipamentList=${equipamentId}`)
    .pipe(map((resp: any[]) => {
      return resp;
    }));
  }

  bulkScheduling(bulkScheduling: any): Observable<any>{
    return this.http.post(`${environment.URL_API}${URL_CALENDARS}/bulk-scheduling`,bulkScheduling)
    .pipe(map((resp: Calendar) => {
      return resp;
    }))
  }

  invoicing(startDate: string, endDate: string, clientId: string, equipamentId: string, status: string): Observable<any[]>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/report?DataInicial=${startDate}&DataFinal=${endDate}&ClientId=${clientId}&EquipamentId=${equipamentId}&status=${status}`)
    .pipe(map((resp: Calendar[]) => {
      return resp;
    }));
  }
}


