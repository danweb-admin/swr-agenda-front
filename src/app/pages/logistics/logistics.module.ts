import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule } from 'ngx-mask'
import { MatTabsModule } from '@angular/material/tabs';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { LogisticsRoutingModule } from './logistics-routing.module';
import { LogisticsPageComponent } from './containers/logistics-page.component';
import { LogisticsTableComponent } from './components/logistics-table/logistics-table.component';
import { LogisticsDialogComponent } from './components/logistics-dialog/logistics-dialog.component';

@NgModule({
  declarations: [
      LogisticsPageComponent,
      LogisticsTableComponent,
      LogisticsDialogComponent,
  ],
  imports: [
    CommonModule,
    LogisticsRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
  providers: [
    EquipamentsService
  ]
})
export class LogisticsModule { }
