import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LogisticsService } from "src/app/shared/services/logistics.service";

@Component({
  selector: 'app-data-log-dialog',
  templateUrl: './data-log-dialog.component.html',
  styleUrls: ['./data-log-dialog.component.scss'],
})
export class DataLogDialogComponent implements OnInit{
  
  @Input() observacao = '';
  
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  formBuilder: any;
  
  
  constructor(public dialogRef: MatDialogRef<DataLogDialogComponent>,
    private fb: FormBuilder,
    private logisticService: LogisticsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any){
      
      
    }
    ngOnInit(): void {
      
      const data = new Date(this.data.element.dataHoraLogistica);
      
      const hora = 
      data.getHours().toString().padStart(2, '0') + ':' +
      data.getMinutes().toString().padStart(2, '0');
      
      this.form = this.fb.group({
        id: [this.data.element.id],
        horaLogistica: [hora]
      });
    }
    fechar(): void {
      this.close.emit();
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onSubmit(): void {
      
      const hora = this.form.value.horaLogistica;
      
      const dataOriginal = new Date(
        this.data.element.dataHoraLogistica
      );
      
      const ano = dataOriginal.getFullYear();
      const mes = (dataOriginal.getMonth() + 1).toString().padStart(2, '0');
      const dia = dataOriginal.getDate().toString().padStart(2, '0');
      
      const dataHoraLogistica =
      `${ano}-${mes}-${dia}T${hora}:00`;
      
      const objeto = {
        id: this.form.value.id,
        dataHoraLogistica: dataHoraLogistica
      };
      
      this.logisticService.updateDataLog(
        objeto
      ).subscribe((resp) => {
        this.toastr.success('Hora da Logística atualizada com sucesso');
      
        this.dialogRef.close(resp);
      }, (error: any) => {
        this.toastr.warning(error.error?.errorMessage)
      })
      
    }
  }