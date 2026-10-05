import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonService } from 'src/app/shared/services/people.service';
import { Person } from 'src/app/shared/models/person';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarService } from 'src/app/shared/services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { Equipament } from 'src/app/shared/models/equipament';

@Component({
    selector: 'app-aparelho-update-dialog',
    templateUrl: 'aparelho-update-dialog.component.html',
    styleUrls: ['./aparelho-update-dialog.component.scss']
})
export class AparelhoUpdateDialogComponent implements OnInit {
    form: FormGroup;
    isDriver: boolean;
    equipamentResult: Equipament[];
    
    constructor(public dialogRef: MatDialogRef<AparelhoUpdateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private personService: PersonService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private equipamentService: EquipamentsService,
        
        private calendarService: CalendarService) {
            this.isDriver = data.isDriver;
        }
        
        ngOnInit(): void {
            this.createForm();
            this.ajusteCSS();
            this.getEquipaments();
        }
        
        createForm(): void {
            this.form = this.formBuilder.group({
                calendarId: [this.data.element.id],
                equipamentId: ['']
            });
        }
        
        getEquipaments(): void{
            this.equipamentService.loadEquipaments(true).subscribe((resp: Equipament[]) => {
                this.equipamentResult = resp;
            })
        }
        
        onNoClick(): void {
            this.dialogRef.close();
        }
        
        onSubmit(): void {
            
            this.calendarService.updateEquipment(
                this.form.value.calendarId,
                this.form.value.equipamentId
            ).subscribe((resp) => {
                this.toastr.success('Aparelho atualizado com sucesso');
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