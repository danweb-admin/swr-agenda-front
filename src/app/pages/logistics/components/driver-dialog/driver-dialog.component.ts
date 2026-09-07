import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonService } from 'src/app/shared/services/people.service';
import { Person } from 'src/app/shared/models/person';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { LogisticsService } from 'src/app/shared/services/logistics.service';

@Component({
    selector: 'app-driver-dialog',
    templateUrl: 'driver-dialog.component.html',
    styleUrls: ['./driver-dialog.component.scss']
})
export class DriverDialogComponent implements OnInit {
    form: FormGroup;
    isDriver: boolean;
    personResult: Person[];
    
    constructor(public dialogRef: MatDialogRef<DriverDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private personService: PersonService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private logisticService: LogisticsService) {
            this.isDriver = data.isDriver;
        }
        
        ngOnInit(): void {
            this.personService.loadPeople(true).subscribe((resp: Person[]) => {
                if (this.isDriver){
                    this.personResult = resp.filter(x => x.personType === 'M');
                }else{
                    this.personResult = resp.filter(x => x.personType === 'T');
                }
            });
            this.createForm();
            this.ajusteCSS();
        }
        
        createForm(): void {
            console.log(this.data)
            this.form = this.formBuilder.group({
                id: [this.data.element.id],
                driverId: [''],
                calendarId: [this.data.element.calendarId],
                tipo: [this.data.element.tipo]
            });
        }
        
        onNoClick(): void {
            this.dialogRef.close();
        }
        
        onSubmit(): void {
            
            
            this.logisticService.updateDriver(
                this.form.value
            ).subscribe((resp) => {
                this.toastr.success('Motorista atualizado com sucesso');
                
                this.dialogRef.close(resp);
            }, (error: any) => {
                this.toastr.warning(error.error?.errorMessage)
            })
            
        }
        
        ajusteCSS(): void {
            document.querySelectorAll<HTMLElement>('.mat-dialog-content')
            .forEach(el => el.setAttribute("style","height: 100px !important"));
            
            document.querySelectorAll('.mat-select')
            .forEach(el => el.setAttribute('style', 'display: contents'));
            
        }
    }