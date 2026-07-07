import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Logistics } from 'src/app/shared/models/logistics';
import { LogisticsService } from 'src/app/shared/services/logistics.service';
import { LogisticsDialogComponent } from '../logistics-dialog/logistics-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-logistics-table',
    templateUrl: './logistics-table.component.html',
    styleUrls: ['./logistics-table.component.scss'],
    
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
    
    constructor(
        public dialog: MatDialog, 
        private service: LogisticsService,
        
    ) { 
        
    }
    
    ngOnInit(): void {
        this.data = new Date();
        this.carregar();
        this.ajustesCSS();
    }
    
    carregar() {
        this.loading = true;
        
        this.service.getByDate(this.data)
        .subscribe({
            
            next: (resp) => {
                this.eventos = resp.sort((a,b)=>{
                    return a.dataHora.localeCompare(b.dataHora);
                });
                this.carregarMotoristas();
                this.logistics = resp;
                this.filteredLogistics = [...resp];
                
                this.loadDrivers();
                this.loading = false;
            },
            
            error: () => {
                this.loading = false;
            }
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
    
    filterDriver(){
        
        if(!this.driverSelected){
            this.filteredLogistics = [...this.logistics];
            return;
        }
        this.filteredLogistics = this.logistics.filter(x =>
            x.driverId === this.driverSelected
        );
    }
    
    loadDrivers(){
        
        const map = new Map<string, any>();
        
        this.logistics.forEach(item => {
            if(item.driverId){
                map.set(item.driverId,{
                    id: item.driverId,
                    name: item.motorista
                });
            }
            
        });
        this.drivers = Array.from(map.values())
        .sort((a,b)=>a.name.localeCompare(b.name));
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
    }
    
    private carregarMotoristas() {
        
        const lista = this.eventos
        .filter(x => x.driverId && x.motorista)
        .map(x => ({
            id: x.driverId,
            name: x.motorista
        }));
        
        this.drivers = lista.filter(
            (driver, index, self) =>
                index === self.findIndex(d => d.id === driver.id)
        );
        
    }
    
}