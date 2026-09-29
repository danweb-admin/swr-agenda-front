import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LogisticsService } from "src/app/shared/services/logistics.service";

@Component({
  selector: 'app-observation-dialog',
  templateUrl: './observation-dialog.component.html',
  styleUrls: ['./observation-dialog.component.scss'],
})
export class ObservationDialogComponent implements OnInit{
  
  @Input() observacao = '';
  
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  formBuilder: any;
  
  
  constructor(public dialogRef: MatDialogRef<ObservationDialogComponent>,
    private fb: FormBuilder,
    private logisticService: LogisticsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any){
    
      
    }
    ngOnInit(): void {

      console.log(this.data)
      this.form = this.fb.group({
        id:[this.data.element.id],
        observacao:[this.data.element.observacao],
      });
    }
    fechar(): void {
      this.close.emit();
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onSubmit(): void {


      this.logisticService.updateObservacao(
        this.form.value
      ).subscribe((resp) => {
        this.toastr.success('Observação atualizada com sucesso');
      
        this.dialogRef.close(resp);
      }, (error: any) => {
        this.toastr.warning(error.error?.errorMessage)
      })
      
    }
  }