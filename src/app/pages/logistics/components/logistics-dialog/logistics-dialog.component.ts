import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { LogisticsService } from 'src/app/shared/services/logistics.service';

@Component({
    selector: 'app-logistics-dialog',
    templateUrl: './logistics-dialog.component.html',
    styleUrls: ['./logistics-dialog.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class LogisticsDialogComponent implements OnInit {
    
    form!: FormGroup;
    
    salvando = false;
    todayDate;
    
    constructor(
        private fb: FormBuilder,
        private logisticsService: LogisticsService,
        private toastr: ToastrService,
        private dialogRef: MatDialogRef<LogisticsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){
        this.todayDate = new Date();
    }
    
    ngOnInit(): void {
        
        this.form = this.fb.group({
            id:[null],
            dataHora:[this.data.data, Validators.required],
            hora:['08:00', Validators.required],
            titulo:['', Validators.required],
            descricao:[''],
            endereco:['',Validators.required],
            observacao:[''],
            driverId:[null, Validators.required ],
            tipo:[3], // Evento Extra
            concluido:[false]
        });
        
        if(this.data.evento){
            this.form.patchValue(this.data.evento);
            this.form.patchValue({
                hora: this.getHora(this.data.evento.dataHora)
            });
        }
        this.ajustesCSS()
        this.form.markAllAsTouched();
    }
    
    salvar(){
        
        if(this.form.invalid)
            return;
        
        this.salvando = true;
        const value = this.form.value;
        const data = new Date(value.dataHora);
        const hora = value.hora.split(':');
        data.setHours(+hora[0]);
        data.setMinutes(+hora[1]);
        
        value.dataHora = this.formatDate(data);
        
        if(value.id){
            
            this.logisticsService.update(value)
            .subscribe(resp=>{
                this.toastr.success("Evento atualizado.");
                
                this.dialogRef.close(true);
                
            });
            
        }else{
            
            this.logisticsService.save(value)
            .subscribe(resp=>{
                this.toastr.success("Evento criado.");
                this.dialogRef.close(true);
            });
        }
    }
    
    cancelar(){
        this.dialogRef.close();
    }
    
    getHora(data:any){
        
        const d = new Date(data);
        return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);
        
    }
    
    validarHora(): void {
        
        const control = this.form.get('hora');
        
        let hora = control?.value;
        
        if (!hora) {
            return;
        }
        
        hora = hora.trim();
        
        // Adiciona ":" automaticamente
        if (/^\d{4}$/.test(hora)) {
            hora = hora.substring(0, 2) + ':' + hora.substring(2);
        }
        
        const partes = hora.split(':');
        
        if (partes.length !== 2) {
            control?.setErrors({ horaInvalida: true });
            return;
        }
        
        const h = Number(partes[0]);
        const m = Number(partes[1]);
        
        if (
            isNaN(h) ||
            isNaN(m) ||
            h < 0 || h > 23 ||
            m < 0 || m > 59
        ) {
            control?.setErrors({ horaInvalida: true });
            this.toastr.error('Verifique o campo Hora, formato incorreto!')
            return;
        }
        
        // Formata para HH:mm
        control?.setValue(
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
            { emitEvent: false }
        );
        
        control?.setErrors(null);

        
    }
    
    ajustesCSS(){
        var mat_select = document.getElementsByClassName('mat-select');
        
        for (var i = 0; i < mat_select.length; i++) {
            mat_select[i].setAttribute('style', 'display: contents');
        }
    }
    
    formatDate(date: Date): string {
        
        return date.getFullYear() + '-' +
        ('0' + (date.getMonth()+1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + 'T' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':00';
        
    }
    
}