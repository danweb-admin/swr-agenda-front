import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { NotificacaoRoutingModule } from './notificacao-routing.module';
import { NotificacaoPageComponent } from './containers/notificacao-page/notificacao-page.component';
import { NotificacaoTableComponent } from './components/notificacao-table/notificacao-table.component';


@NgModule({
  declarations: [
    NotificacaoPageComponent,
    NotificacaoTableComponent
  ],
  imports: [
    CommonModule,
    NotificacaoRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class NotificacaoModule { }
