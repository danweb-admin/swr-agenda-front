import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { LogisticsService } from "src/app/shared/services/logistics.service";

@Component({
  selector: 'app-observation-dialog',
  templateUrl: './observation-dialog.component.html',
  styleUrls: ['./observation-dialog.component.scss'],
})
export class ObservationDialogComponent implements OnInit {

  @Input() observacao: any;

  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private logisticService: LogisticsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    console.log(this.observacao);

    this.form = this.fb.group({
      id: [this.observacao.id],
      observacao: [this.observacao.observacao],
    });
  }

  fechar(): void {
    this.close.emit();
  }

  onSubmit(): void {

    this.logisticService.updateObservacao(
      this.form.value
    ).subscribe(
      (resp) => {

        this.toastr.success(
          'Observação atualizada com sucesso'
        );

        this.close.emit();

      },
      (error: any) => {

        this.toastr.warning(
          error.error?.errorMessage
        );

      }
    );
  }

  onNoClick(){
    
  }
}