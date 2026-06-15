import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { MY_FORMATS } from 'src/app/consts/my-format';
import html2canvas from 'html2canvas';
import { FormGroup } from '@angular/forms';
import { Equipament } from 'src/app/shared/models/equipament';

@Component({
  selector: 'app-agenda-table',
  templateUrl: './agenda-table.component.html',
  styleUrls: ['./agenda-table.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AgendaTableComponent implements OnInit {
  
  months: any = [];
  monthSelected: any;
  equipamentResult: Equipament[];
  list: any = [];
  form: FormGroup;
  days_: any = [];
  showTable: boolean = false;
  monthYear_: string;
  years: any = [];

  
  constructor() {
    
  }

  ngAfterViewInit(): void {
    this.ajusteCSS();
    
  }

  addYears() {
    var start = new Date();

    var loop = -1;
    while(loop < 10){
      this.years.push(start.getFullYear() + loop);
      loop++;
    };    
  }

  public ngOnInit(): void {
    this.getEquipaments();
    this.createForm();
    this.initializeMonths();
    this.addYears();
  }

  change(){
    
    let month = this.form.value.month;
    let year = this.form.value.year;
    if (month === undefined || year === undefined)
      return;
    this.showTable = true;
    this.days_ = this.getDaysInMonthUTC(month - 1,year);
  }

  clear(){
    window.location.reload();
  }

  createForm(): void {
    
  }

  getDaysInMonthUTC(month, year) {
    
    if (year === null)
      year = new Date().getFullYear();

    this.monthYear_ = `${this.months.filter(x => x.id === month + 1)[0].month}/${year}`

    let date = new Date(year, month, 1);
    let days = [];
    while (date.getUTCMonth() === month) {
      days.push(moment(new Date(date)));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    
    return days;
  }

  getEquipaments(): void{
    
  }

  onSubmit(): void {
    
  }

  download(){
    var container = document.getElementById("main-table");
        html2canvas(container,{allowTaint : true}).then(function(canvas) {
        
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.download = "html_image.png";
            link.href = canvas.toDataURL("image/jpg");
            link.target = '_blank';
            link.click();
        });
  }

  ajusteCSS(): void {
    document
          .querySelectorAll<HTMLElement>('.header__title-button-icon')
          .forEach(node => node.click())
  }

  initializeMonths(): void{
    this.months = [
          {
            id: 1,
            month: 'Janeiro'
          },
          {
            id: 2,
            month: 'Fevereiro'
          },
          {
            id: 3,
            month: 'Março'
          },
          {
            id: 4,
            month: 'Abril'
          },
          {
            id: 5,
            month: 'Maio'
          },
          {
            id: 6,
            month: 'Junho'
          },
          {
            id: 7,
            month: 'Julho'
          },
          {
            id: 8,
            month: 'Agosto'
          },
          {
            id: 9,
            month: 'Setembro'
          },
          {
            id: 10,
            month: 'Outubro'
          },
          {
            id: 11,
            month: 'Novembro'
          },
          {
            id: 12,
            month: 'Dezembro'
          },
    ]
  }
  
}