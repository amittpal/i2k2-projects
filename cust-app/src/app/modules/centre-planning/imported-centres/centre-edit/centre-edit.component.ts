import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-centre-edit',
  templateUrl: './centre-edit.component.html',
  styleUrls: ['./centre-edit.component.scss']
})
export class CentreEditComponent implements OnInit {
  public editCentresFormGroup: FormGroup;
  private appRoutes:any={};
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  phSeatAllo: any = 0;
  normalSeatAllo: number = 0;
  totalAllo: number = 0;
  importedId:any;
  constructor(private route: ActivatedRoute, private restService: GlobalRestService,private configService: AppsettingsConfService,
    private messageService: MessageService, private primaryHeader: PrimaryHeaderService) {
  
   this.restService.ShowLoadingSpinner = true;
   this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
   this.configService.getAppRoutes.subscribe(configData => {
     this.appRoutes = configData;
   }, error => {
     console.error('Error for configService.getAppRoutes: ', error);
   });}

 ngOnInit() {
   //setting page title
   this.primaryHeader.pageTitle.next("Cenytres Edit");
   this.editCentresFormGroup = new FormGroup({
     import_number:new  FormControl({value:'',disabled:true}),
     name: new FormControl({value: '', disabled: true}),
     code: new FormControl({value: '', disabled: true}),
     description: new FormControl({value: '', disabled: true}),
     status: new FormControl({value: '', disabled: true}),
     regName:new FormControl({value:'',disabled:true})
   });
   this.route.params.subscribe((params: Params) => {
     this.getData(params['id']);
   }, error => {
     console.error('Error: ', error);
   });
 }
 getData(id: any) {
   var keyData = [
     {
     "name": "Id",
     "value": id
     }
   ];
   this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresById;
   this.restService.callApi(keyData)
     .subscribe(sucessResponse => {     
       this.initializeFields(sucessResponse.imported_centres[0]);
       this.importedId=sucessResponse.imported_centres[0].id
       this.getImportedCentres();                
     });  
 } 
 public initializeFields(result:any) {
   this.editCentresFormGroup = new FormGroup({
     import_number: new FormControl({value: result.import_number, disabled: true}),
     name: new FormControl({value: result.name, disabled: true}),
     code: new FormControl({value: result.code, disabled: true}),
     description: new FormControl({value: result.description, disabled: true}),
     status: new FormControl({value: result.status, disabled: true}),
     regName:new FormControl({value:result.registration_Name,disabled:true})
   });    
 }

 getImportedCentres()
 {
  this.phSeatAllo= 0;
  this.normalSeatAllo= 0;
  this.totalAllo= 0;
   var keyData = [
     {
     "name": "importedId",
     "value": this.importedId
     }
   ];
   this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresListById;
   this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
   this.restService.callApi(keyData)
   .subscribe(sucessResponse => {
     
     this.items = sucessResponse.no_of_shifts;
     this.itemCount = this.items.length;
     this.items.forEach((element, i) => {
       this.phSeatAllo += parseInt(element["pwd_seats"]);
       this.normalSeatAllo += parseInt(element["normal_seats"]);
       this.totalAllo += parseInt(element["total_seats"]);
   });

     this.items.push({
       city_name: "",
       state_name: "Total",
       pwd_seats: this.phSeatAllo,
       normal_seats: this.normalSeatAllo,
       total_seats: this.totalAllo
     });
   },
   errorResponse => {     
     this.items=[];
     this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
   });

}
}
 

