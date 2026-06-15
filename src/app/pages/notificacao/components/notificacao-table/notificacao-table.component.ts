import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { stat } from 'fs';
import { ModelService } from 'src/app/shared/services/model.service';
import { NotificacaoService } from 'src/app/shared/services/notificacao.service';


@Component({
  selector: 'app-notificacao-table',
  templateUrl: './notificacao-table.component.html',
  styleUrls: ['./notificacao-table.component.scss']
})
export class NotificacaoTableComponent implements OnInit {
  public dataSource: any[] = [];

  constructor(public dialog: MatDialog,
    private notificacaoService: NotificacaoService,
    private datePipe: DatePipe) {}

  public ngOnInit(): void {
    this.loadnotificacoes();
  }

  loadnotificacoes(){
    this.notificacaoService.loadNotificacoes().subscribe((resp: any[]) => {
      this.dataSource = resp;
      console.log(resp)
    });
  }

  locacaoDescribe(item: any){
    let retorno = new Array();

    let cliente = 'Loc: ' + item.locacao.client.name;
    
    let horaInicio = this.datePipe.transform(item.locacao.startTime, 'HH:mm');
    let horafim = this.datePipe.transform(item.locacao.endTime, 'HH:mm');

    let dataLocacao = 'Data: ' + this.datePipe.transform(item.locacao.date, 'dd/MM/yy') + ' ' + horaInicio + ' a ' + horafim;

    let aparelho  = 'Equip: ' + item.locacao.equipament.name;

    retorno.push(cliente)
    retorno.push(dataLocacao)
    retorno.push(aparelho)

    return retorno.join(' - ')
  }

  statusDescribe(status: any){

    switch (status) {
        case 'P':
            return 'Pendente'

        case 'E':
            return 'Enviado';

        case 'R':
            return 'Respondido';
        
    }
  }

  respostaDescribe(resposta: any){
    if (resposta == null)
        return '';
    return resposta;
  }

  formatarTelefone(telefone: string): string {

    if (telefone == null)
        return '';

    const numero = telefone.replace(/^55/, '');

    if (numero.length === 11) {
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    }

    if (numero.length === 10) {
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }

    return telefone;
  }


  public showAtivo(ativo: boolean): string {
    if (ativo)
      return 'Ativo';
    return 'Inativo';
  }

  openDialog(element: any): void {
    
    // const dialogRef = this.dialog.open(ModelConfigurationDialogComponent, {
    //   width: '800px',
    //   height: '600px',
    //   data: {element}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === undefined)
    //     return;

    //   this.loadModels();
    // });
  }
}