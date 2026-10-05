import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Logistics } from 'src/app/shared/models/logistics';
import { LogisticsService } from 'src/app/shared/services/logistics.service';
import { LogisticsDialogComponent } from '../logistics-dialog/logistics-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { DriverDialogComponent } from '../driver-dialog/driver-dialog.component';
import { ObservationDialogComponent } from '../observation-dialog/observation-dialog.component';
import { DataLogDialogComponent } from '../data-log-dialog/data-log-dialog.component';
import { PersonService } from 'src/app/shared/services/people.service';
import { Person } from 'src/app/shared/models/person';

@Component({
    selector: 'app-logistics-table',
    templateUrl: './logistics-table.component.html',
    styleUrls: ['./logistics-table.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class LogisticsTableComponent implements OnInit {
    
    @Input() data!: Date;
    
    @Output() novoEvento = new EventEmitter<void>();
    @Output() editar = new EventEmitter<Logistics>();
    
    eventos: Logistics[] = [];
    
    loading = false;
    logistics: Logistics[] = [];
    filteredLogistics: Logistics[] = [];
    
    drivers: any[] = [];
    
    driverSelected: string | null = null;
    @ViewChild('inputSearch') inputSearch: ElementRef;
    time;
    
    showObservacao = false;
    observacaoSelecionada = '';
    
    
    constructor(
        public dialog: MatDialog, 
        private service: LogisticsService,
        private toastrService: ToastrService,
        private personService: PersonService
        
    ) { 
        
    }
    
    ngOnInit(): void {
        this.data = new Date();
        this.getPeople();
        this.carregar();
        this.ajustesCSS();
    }
    
    applyFilter(event: Event): void {
        
        let length = this.inputSearch.nativeElement.value.length;
        // let charCode = (event.which) ? event.which : event.keyCode;
        // 
        // if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57) || length < 10) {
        //     event.preventDefault();
        //     return;
        // }
        
        let data = moment(this.inputSearch.nativeElement.value, 'DD-MM-YYYY', true).isValid()
        if (!data){
            this.toastrService.info("Data está incorreta!");
            return;
        }
        
        this.data = moment(this.inputSearch.nativeElement.value, 'DD-MM-YYYY', true).toDate();
        this.carregar();
    }
    
    carregar() {
        this.loading = true;
        
        this.service.getByDate(this.data)
        .subscribe({
            
            next: (resp) => {
                this.eventos = resp.sort((a,b)=>{
                    return a.dataHora.localeCompare(b.dataHora);
                });
                
                this.logistics = resp;
                this.filteredLogistics = [...resp];
                
                this.loading = false;
            },
            
            error: () => {
                this.loading = false;
            }
        });
    }
    
    openDialogDriver(element: any, isCollect: boolean){
        let isDriver = true;
        
        const dialogRef = this.dialog.open(DriverDialogComponent, {
            width: '400px',
            height: '250px',
            disableClose: true,
            data: {element, isDriver, isCollect}
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined)
                return;
            
            this.carregar();           
        });
    }
    
    openDialogObservation(element: any){
        const dialogRef = this.dialog.open(ObservationDialogComponent, {
            width: '400px',
            height: '250px',
            disableClose: true,
            data: {element}
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined)
                return;
            
            this.carregar();           
        });
    }
    
    openDialogHoraLog(element: any){
        const dialogRef = this.dialog.open(DataLogDialogComponent, {
            width: '400px',
            height: '250px',
            disableClose: true,
            data: {element}
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined)
                return;
            
            this.carregar();           
        });
    }
    
    getTipo(tipo:number){
        switch(tipo){
            
            case 1: 
            return 'Entrega';
            case 2: 
            return 'Recolhe';
            case 3: 
            return 'Evento';
            default: 
            return '';
            
        }
    }
    
    abrirObservacao(item: any): void {
        
        this.observacaoSelecionada = item.observacaoGoogle;
        this.showObservacao = true;
    }
    
    fecharObservacao(): void {
        this.showObservacao = false;
        this.observacaoSelecionada = '';
    }
    
    fecharModal() {
        // this.showModal = false;
    }
    
    alterarStatus(item: any) {
        
        const novoStatus = item.concluido;
        
        if (novoStatus == false){
            this.service.uncomplete(item.id, novoStatus).subscribe({
                next: () => {
                    item.concluido = novoStatus;
                },
                error: (erro) => {
                    this.toastrService.error("Erro na atualização do status")
                }
            });
        }else{
            this.service.complete(item.id, novoStatus).subscribe({
                next: () => {
                    item.concluido = novoStatus;
                },
                error: (erro) => {
                    this.toastrService.error("Erro na atualização do status")
                }
            });
        }
        
        
    }
    
    filterDriver(){
        
        if(!this.driverSelected){
            this.filteredLogistics = [...this.logistics];
            return;
        }
        this.filteredLogistics = this.logistics.filter(x =>
            x.driverId === this.driverSelected
        );
    }
    
    
    openDialog(){
        
        const dialog = this.dialog.open(LogisticsDialogComponent,{
            width:'700px',
            disableClose:true,
            data:{
                data:this.data,
                motoristas:this.drivers   
            }
        });
        
        dialog.afterClosed()
        .subscribe(resp=>{
            
            if(resp){
                this.carregar();   
            }
        });
        
    }
    
    ajustesCSS(){
        var mat_select = document.getElementsByClassName('mat-select');
        
        for (var i = 0; i < mat_select.length; i++) {
            mat_select[i].setAttribute('style', 'display: contents');
        }
        
        document
        .querySelectorAll<HTMLElement>('.header__title-button-icon')
        .forEach(node => node.click())
    }
    
    formatarHora(dataHora: any): string {
        
        const data = new Date(dataHora);
        
        return (
            data.getHours().toString().padStart(2, '0') +
            ':' +
            data.getMinutes().toString().padStart(2, '0')
        );
    }
    
    getPeople(): void {
        this.personService.loadPeople(true).subscribe((resp: Person[]) => {
            this.drivers = resp.filter(x => x.personType === 'M');
        })
    }
    
    gerarDescritivo() {
        
        if (!this.filteredLogistics || this.filteredLogistics.length === 0) {
            return;
        }
        
        const primeiro = this.filteredLogistics[0];
        
        const data = new Date(primeiro.dataHoraLogistica);
        
        const diasSemana = [
            'Domingo',
            'Segunda-feira',
            'Terça-feira',
            'Quarta-feira',
            'Quinta-feira',
            'Sexta-feira',
            'Sábado'
        ];
        
        const diaSemana = diasSemana[data.getDay()];
        
        const dataFormatada =
        `${data.getDate().toString().padStart(2, '0')}/` +
        `${(data.getMonth() + 1).toString().padStart(2, '0')}/` +
        `${data.getFullYear()}`;
        
        let texto = '';
        
        texto += `Logística ${diaSemana} ${dataFormatada}\n\n`;
        
        texto += `Motorista: ${primeiro.motorista}\n`;
        texto += `Veículo: ${primeiro.placa}\n`;
        texto += `Logística: ${this.filteredLogistics.length}\n\n`;
        
        this.filteredLogistics.forEach((item, index) => {
            
            const hora = this.formatarHora(
                item.dataHoraLogistica
            );
            
            const numero = this.numeroEmoji(index + 1);
            
            let acao = '';
            
            switch (item.tipo) {
                case 1:
                acao = 'Entregar';
                break;
                
                case 2:
                acao = 'Recolher';
                break;
                
                default:
                acao = 'Extra';
                break;
            }
            
            console.log(item.tipo);
            
            const equipamento = item.equipamento || '';
            const cliente = item.cliente || '';
            const local = item.local || '';
            
            texto += `${numero}️ ${hora} - ${acao} ${equipamento}`;
            
            if (cliente) {
                texto += ` na ${cliente}`;
            }
            
            if (local) {
                texto += ` em ${local}`;
            }
            
            texto += `\n`;
        });
        
        console.log(texto);
        
        navigator.clipboard.writeText(texto);
    }
    
    numeroEmoji(numero: number): string {
        
        const emojis: { [key: string]: string } = {
            '0': '0️⃣',
            '1': '1️⃣',
            '2': '2️⃣',
            '3': '3️⃣',
            '4': '4️⃣',
            '5': '5️⃣',
            '6': '6️⃣',
            '7': '7️⃣',
            '8': '8️⃣',
            '9': '9️⃣'
        };
        
        return numero
        .toString()
        .split('')
        .map(digito => emojis[digito])
        .join('');
    }
    
    
}