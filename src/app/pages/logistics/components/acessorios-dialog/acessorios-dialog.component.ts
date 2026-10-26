import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { LogisticsService } from "src/app/shared/services/logistics.service";

@Component({
  selector: 'app-acessorios-dialog',
  templateUrl: './acessorios-dialog.component.html',
  styleUrls: ['./acessorios-dialog.component.scss'],
})
export class AcessorioDialogComponent implements OnInit{
  
  @Input() observacao = '';
  
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  formBuilder: any;
  
  
  constructor(public dialogRef: MatDialogRef<AcessorioDialogComponent>,
    private fb: FormBuilder,
    private logisticService: LogisticsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any){
      
      
    }
    ngOnInit(): void {
      debugger
      
      this.form = this.fb.group({
        id: [this.data.element.id],
        acessorio: [this.data.element.acessori]
      });
    }

    fechar(): void {
      this.close.emit();
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onSubmit(): void {
      const objeto = {
        id: this.form.value.id,
        acessorios: this.form.value.acessorio
      };
      
      this.logisticService.updateAcessorio(
        objeto
      ).subscribe((resp) => {
        this.toastr.success('Acessório atualizado com sucesso');
      
        this.dialogRef.close(resp);
      }, (error: any) => {
        this.toastr.warning(error.error?.errorMessage)
      })
      
    }
  }