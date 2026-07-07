import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { NotificacaoPageComponent } from './containers/notificacao-page/notificacao-page.component';

const routes: Routes = [
  {
    path: '',
    component: NotificacaoPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class NotificacaoRoutingModule {
}
