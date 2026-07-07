import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LogisticsPageComponent } from './containers/logistics-page.component';


const routes: Routes = [
  {
    path: '',
    component: LogisticsPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class LogisticsRoutingModule {
}
