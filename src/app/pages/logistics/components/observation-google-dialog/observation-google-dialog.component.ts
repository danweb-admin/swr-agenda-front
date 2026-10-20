import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-observation-google-dialog',
  templateUrl: './observation-google-dialog.component.html',
  styleUrls: ['./observation-google-dialog.component.scss']
})
export class ObservationGoogleDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { html: string },
    private dialogRef: MatDialogRef<ObservationGoogleDialogComponent>
  ) {}

  fechar(): void {
    this.dialogRef.close();
  }
}