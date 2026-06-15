import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import moment, { Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { Calendar } from 'src/app/shared/models/calendar';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-agenda-page',
  templateUrl: './agenda-page.component.html',
  styleUrls: ['./agenda-page.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AgendaPageComponent implements OnInit {
  
  token: string = '';
  loading = true;
  sucesso = false;
  @ViewChild('inputSearch') inputSearch: ElementRef;
  dataSource: [];
  time;
  
  constructor(
    private calendarService: CalendarService,
    private toastrService: ToastrService,
    
  ) { 
    this.time = moment();
  }
  
  ngOnInit(): void {
    this.getCalendars();
  }
  
  lastDay(): void {
    this.time = moment(this.time, 'DD-MM-YYYY', true).add(-1,'days');
    this.getCalendars();
  }
  
  today(): void {
    window.location.reload();
  }
  
  followingDay(): void {
    
    this.time = moment(this.time, 'DD-MM-YYYY', true).add(1,'days');
    this.ngOnInit();
  }
  
  applyFilter(event): void {
    let length = this.inputSearch.nativeElement.value.length;
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57) || length < 10) {
      event.preventDefault();
      return;
    }
    
    let data = moment(this.inputSearch.nativeElement.value, 'DD-MM-YYYY', true).isValid()
    if (!data){
      this.toastrService.info("Data está incorreta!");
      return;
    }
    this.time = moment(this.inputSearch.nativeElement.value, 'DD-MM-YYYY', true);
    this.getCalendars();
  }
  
  showTime(item: Calendar){
    let start = ''
    let end = '';
    if (item.startTime)
      start = item.startTime.substring(11,16);
    if (item.endTime)
      end = item.endTime.substring(11,16)
    return start + ' - ' + end;
  }
  
  statusToString(status): string{
    let ret = 'Confirmada';
    switch (status){
      case '2':
      ret = 'Pendente';
      break;
      case '3':
      ret = 'Cancelada';
      break;
      case '4':
      ret = 'Excluida';
      break;
      case '5':
      ret = 'Pre-Agendada'
      break;
    }
    
    return ret;
  }
  
  getCalendars(): void{
    this.time = moment(this.time, 'DD-MM-YYYY', true);
    let date = this.time.format('YYYY-MM-DD');
    this.calendarService.getCalendarByDayVisualizacao(date).subscribe((resp: any) => {
      console.log(resp)
      this.dataSource = resp;
    });
  }
  
}
