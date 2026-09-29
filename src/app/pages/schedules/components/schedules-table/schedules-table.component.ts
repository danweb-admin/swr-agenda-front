import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../../../shared/services/clients.service';
import { EquipamentsService } from '../../../../shared/services/equipaments.service';
import { SpecificationsService } from 'src/app/shared/services/specifications.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { MatTableDataSource } from '@angular/material/table';
import { Calendar } from 'src/app/shared/models/calendar';
import { SelectionModel } from '@angular/cdk/collections';
import { Specification } from 'src/app/shared/models/specification';
import { Equipament } from 'src/app/shared/models/equipament';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PersonService } from 'src/app/shared/services/people.service';
import { Person } from 'src/app/shared/models/person';
import { CalendarDialogComponent } from 'src/app/pages/calendar/components/calendar-dialog/calendar-dialog.component';



@Component({
    selector: 'app-schedules-table',
    templateUrl: 'schedules-table.component.html',
    styleUrls: ['./schedules-table.component.scss',],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
  })
  export class SchedulesTableComponent implements OnInit, AfterViewInit{
    
    displayedColumns: string[] = ['data','horario','equipamento','locatario','tecnica','motorista','status','statusPagamento'];
    @ViewChild('inputSearch') inputSearch: ElementRef;
    dataSource: MatTableDataSource<Calendar> = new MatTableDataSource<Calendar>();
    selection = new SelectionModel<Calendar>(true, []);
    selectedTabIndex = 0;
    specificationArray: Specification[];
    equipamentResult: Equipament[];
    clientResult: [];
    inputReadonly = false;
    isLoading = false;
    notFound = false;
    form: FormGroup;
    techniqueResult: Person[];
    driverResult: Person[];
    
    constructor(private calendarService: CalendarService,
                public dialog: MatDialog,
                private specificationSerivce: SpecificationsService,
                private personService: PersonService,
                private formBuilder: FormBuilder,
                private equipamentService: EquipamentsService,
                private clientService: ClientsService,
                private cdr: ChangeDetectorRef) {
    }
    ngAfterViewInit(): void {
      this.ajusteCSS();
    }

    ngOnInit(): void {
      this.loadSpecifications();
      this.getEquipaments();
      this.getPeople();

      this.form = this.formBuilder.group({
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        client: [null],
        equipamentId: [],
        techniqueId: [null],
        driverList: [null],
        status: [null],
        statusPagamento: [null]
      });
      this.onChanges();
    }

    onChanges(){
      this.form.get('client').valueChanges.pipe(
          filter( data => {
            if (typeof data === 'string' || data instanceof String){
              if (data.trim().length <= 2){
                this.isLoading = true;
                this.notFound = false;
                this.clientResult = [];
              }
              return data.trim().length > 2
            }
          }),
          debounceTime(500),
          switchMap(  (search: string) => {
            return search ? this.clientService.getClients(true,search) : of([]);
       })
      ).subscribe(data =>{
        this.clientResult = data as [];
        if (this.clientResult.length == 0)
          this.notFound = true
        else
          this.isLoading = false;
      })
    }

    async loadSpecifications(): Promise<void> {
      await this.specificationSerivce.loadSpecifications().toPromise().then((data) => {
        localStorage.setItem('specificationsList',JSON.stringify(data));
        this.specificationArray = data;
      }); 
    }

    displayFn(item) {
      if (item === null)
        return;
      return item?.name;
    }

    descriptionSpecifications(item: Calendar){
      let retorno = new Array();
      item.calendarSpecifications.forEach(obj => {
        if (obj.active === true){
          let name = this.specificationArray?.find(x => x.id === obj.specificationId);
          if (name){
            retorno.push(name.name);
          }
        }   
      });
      return retorno.join(' - ')
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

    showClientCity(item){
      let ret = [];
      if (item.noCadastre){
        ret.push(item.temporaryName);
      }else{
        let split = item.client.name.split(' ');
        if (split.length > 1){
          ret.push(split[0] + ' ' + split[1]);
        }else{
          ret.push(split[0]);
        }
        ret.push(item.client.city.nome)
      }

      return ret.join(' - ');
    }

    openDialog(element: Calendar){
      const dialogRef = this.dialog.open(CalendarDialogComponent, {
        width: '700px',
        height: '600px',
        disableClose: true,
        data: {element}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === undefined)
          return;
        
        this.onSubmit();           
      });
    }

    statusToString(status){
      let ret = 'Confirmada';
      
      if (status == '2'){
        ret = 'Pendente';
      }else if (status == '3'){
        ret = 'Cancelada';
      }else if (status == '4'){
        ret = 'Excluida';
      }else if (status == '5'){
        ret = 'Pre-Agendada';
      }

      return ret;
    }

    statusPagamentoToString(status){
      let ret = '';
      
      if (status == 'paid'){
        ret = 'Pago';
      }else if (status == 'pending'){
        ret = 'Pendente';
      }

      return ret;
    }

    onSubmit(): void{
      let startDate = this.form.value.startDate.format('yyyy-MM-DD');
      let endDate = this.form.value.endDate.format('yyyy-MM-DD');
      let clientId = '';
      let driverList = this.form.value.driverList === null ? '' : this.form.value.driverList;
      let techniqueId = this.form.value.techniqueId === null ? '' : this.form.value.techniqueId;
      let equipamentIds = this.form.value.equipamentId === null ? '' : this.form.value.equipamentId;
      let status = this.form.value.status === null ? '' : this.form.value.status;
      let statusPagamento = this.form.value.statusPagamento === null ? '' : this.form.value.statusPagamento;

      if (this.form.value.client !== null && this.form.value.client !== ''){
        clientId = this.form.value.client.id;
      }

      this.calendarService.schedules(startDate, endDate, clientId, equipamentIds, driverList,techniqueId, status, statusPagamento)
        .subscribe((resp: Calendar[]) => {
          this.dataSource = new MatTableDataSource<Calendar>();
          this.dataSource = new MatTableDataSource<Calendar>(resp);

          console.log(this.dataSource)
        })
    }

    getEquipaments(): void{
      this.equipamentService.loadEquipaments(true).subscribe((resp: Equipament[]) => {
        this.equipamentResult = resp;
      })
    }

    getPeople(): void {
      this.personService.loadPeople(true).subscribe((resp: Person[]) => {
        this.techniqueResult = resp.filter(x => x.personType === 'T');
        this.driverResult = resp.filter(x => x.personType === 'M');
      })
    }
    
    ajusteCSS(): void {
      document
            .querySelectorAll<HTMLElement>('.header__title-button-icon')
            .forEach(node => node.click())
    }
  }