import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-notificacao-page',
  templateUrl: './notificacao-page.component.html',
  styleUrls: ['./notificacao-page.component.scss']
})
export class NotificacaoPageComponent {

  constructor(private toastrService: ToastrService) {
  }

  
}
