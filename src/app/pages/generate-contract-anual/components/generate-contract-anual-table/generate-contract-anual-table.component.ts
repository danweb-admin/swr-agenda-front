import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModelService } from 'src/app/shared/services/model.service';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/consts/my-format';
import { GenerateContractService } from 'src/app/shared/services/generate-contract.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from "file-saver";
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Equipament } from 'src/app/shared/models/equipament';
import { Specification } from 'src/app/shared/models/specification';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { SignatureHistoryComponent } from 'src/app/pages/generate-contract/components/signature-history/signature-history.component';


@Component({
    selector: 'app-generate-contract-anual-table',
    templateUrl: './generate-contract-anual-table.component.html',
    styleUrls: ['./generate-contract-anual-table.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class GenerateContractAnualTableComponent implements OnInit, AfterViewInit {
    public dataSource: any[] = [];
    @ViewChild('inputSearch') inputSearch: ElementRef;
    time;
    isLoading = false;
    notFound = false;
    form: FormGroup;
    clientResult: [];
    equipmentResult: Equipament[];
    locacoes: any[] = [];
    specificationResult: Specification[];
    todayDate;
    
    
    constructor(private modelService: ModelService,
        private generateContractService: GenerateContractService,
        private toastr: ToastrService,
        private clientService: ClientsService,
        private equipmentService: EquipamentsService,
        
        private formBuilder: FormBuilder,
        public dialog: MatDialog
    ) {
        this.time = moment();
    }
    
    public ngOnInit(): void {
        this.getCalendars();
        this.createForm();
        this.getEquipaments();
        this.onChanges();
    }
    
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.ajustesCSS();
        },500);
    }
    
    ajustesCSS(){
        document.getElementsByClassName("mat-form-field-outline-thick")[0].setAttribute("style","width: 95%");
        var mat_select = document.getElementsByClassName('mat-select');
        for (var i = 0; i < mat_select.length; i++) {
            mat_select[i].setAttribute('style', 'display: contents');
        }
    }
    
    getEquipaments(): void{
        this.equipmentService.loadEquipmentRelationship(true).subscribe((resp: Equipament[]) => {
            this.equipmentResult = resp;
        })
    }
    
    
    buscarLocacoes(){
        
        let clientId = this.form.value.client.id
        let equipmentId = this.form.value.equipmentId
        let startDate = this.form.value.startDate.format('yyyy-MM-DD')
        let endDate = this.form.value.endDate.format('yyyy-MM-DD')
        
        this.generateContractService.getLocacoes(clientId,equipmentId,startDate,endDate).subscribe(resp => {
            this.locacoes = resp
            console.log(resp);
        })
    }
    
    onChanges(){
        this.form.get('client').valueChanges.pipe(
            filter( data => {
                if (typeof data === 'string' || data instanceof String){
                    if (data.trim().length <= 2){
                        this.isLoading = true;
                        this.notFound = false;
                        this.clientResult = [];
                    }
                    return data.trim().length > 2
                }
            }),
            debounceTime(500),
            switchMap(  (search: string) => {
                return search ? this.clientService.getClients(true,search) : of([]);
            })
        ).subscribe(data =>{
            this.clientResult = data as [];
            if (this.clientResult.length == 0)
                this.notFound = true
            else
            this.isLoading = false;
        })
    }
    
    displayFn(item) {
        if (item === null)
            return;
        return item?.name;
    }
    
    createForm() {
        this.form = this.formBuilder.group({
            clientId:  [],
            client: [],
            equipmentId: ['',Validators.required],
            startDate: ['',Validators.required],
            endDate: ['',Validators.required]
        });
    }
    
    followingDay(): void {
        
        this.time = moment(this.time, 'DD-MM-YYYY', true).add(1,'days');
        this.ngOnInit();
    }
    
    selecionarTodos(event: any) {
        const checked = event.target.checked;
        this.locacoes.forEach(l => l.selecionado = checked);
    }
    
    getLocacoesSelecionadas() {
        return this.locacoes.filter(l => l.selecionado);
    }
    
    applyFilter(event){
        this.time = moment(this.inputSearch.nativeElement.value, 'DD-MM-YYYY', true);
        this.getCalendars();
    }
    
    
    loadModels(){
        this.modelService.loadModels().subscribe((resp: any[]) => {
            this.dataSource = resp;
        });
    }
    
    getCalendars(){
        this.time = moment(this.time, 'DD-MM-YYYY', true);
        let date = this.time.format('YYYY-MM-DD');
        
        this.generateContractService.getCalendars(date).subscribe((resp: any) => {
            this.dataSource = resp; 
        });
    }
    
    generateContract(){
        const selecionadas = this.getLocacoesSelecionadas();
        
        if (selecionadas.length === 0) {
            alert('Selecione pelo menos uma locação');
            return;
        }
        
        this.generateContractService.generateMultipleContracts(selecionadas.map(x => x.id).toString()).subscribe((resp: any) => {
            if (resp == null){
                this.toastr.success('Contrato gerado com sucesso!');
            }else{
                this.toastr.error('Erro para gerar o contrato!');
            }
            this.getCalendars();
        },
        (error: any) =>{
            console.log(error);
        
            this.toastr.warning(error.error)
        });
    }
    
    downloadContract(){
        const selecionadas = this.getLocacoesSelecionadas();

        if (selecionadas.length === 0) {
            alert('Selecione pelo menos uma locação');
            return;
        }

        let first = selecionadas[0];

        this.generateContractService.downloadContract(first.id)
        .subscribe(data => saveAs(data, first.contractPath));
    }
    
    digitalSignature(){
        const selecionadas = this.getLocacoesSelecionadas();

        if (selecionadas.length === 0) {
            alert('Selecione pelo menos uma locação');
            return;
        }

        let first = selecionadas[0];

        this.generateContractService.digitalSignature(first.id)
        .subscribe((resp: any) => {
            this.toastr.success('Contrato enviado para Assinatura Digital com sucesso.');
            // this.dataSource = resp; 
        },
        (error: any) =>{
            console.log(error)
        });
    }
    
    history(): void {
        const selecionadas = this.getLocacoesSelecionadas();

        if (selecionadas.length === 0) {
            alert('Selecione pelo menos uma locação');
            return;
        }

        let first = selecionadas[0];

        const dialogRef = this.dialog.open(SignatureHistoryComponent, {
          width: '900px',
          height: '600px',
          data: {first}
        });
        
    }
    
    
}
