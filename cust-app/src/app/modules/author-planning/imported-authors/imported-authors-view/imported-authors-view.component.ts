import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { HandelError, ImportAuthors } from '../../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';

@Component({
  selector: 'app-imported-authors-view',
  templateUrl: './imported-authors-view.component.html',
  styleUrls: ['./imported-authors-view.component.scss']
})
export class ImportedAuthorsViewComponent implements OnInit {

  public viewImportedAuthorsFormGroup:FormGroup;
  private appRoutes:any={};
   public image:any;

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
   this.primaryHeader.pageTitle.next("Imported Centres View");
   this.viewImportedAuthorsFormGroup = new FormGroup({
    authors: new FormControl({value: "", disabled: true}),
    highest_qualification: new FormControl({value:"", disabled: true}),
    mobile_number: new FormControl({value: "", disabled: true}),
    title: new FormControl({value: "", disabled: true}),
    sme: new FormControl({value: "", disabled: true}),
    alternate_mobile_numner: new FormControl({value: "", disabled: true}),
    name: new FormControl({value: "", disabled: true}),
    experience: new FormControl({value: "", disabled: true}),
    phone_number_office: new FormControl({value:"", disabled: true}),
    organization_name: new FormControl({value: "", disabled: true}),
    language: new FormControl({value: "", disabled: true}),
    phone_number_home: new FormControl({value: "", disabled: true}),
    department: new FormControl({value: "", disabled: true}),
    identity_type: new FormControl({value: "", disabled: true}),
    email: new FormControl({value: "", disabled: true}),
    designation: new FormControl({value: "", disabled: true}),
    identity_number: new FormControl({value:"", disabled: true}),
    rating: new FormControl({value:"", disabled: true})
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
   this.restService.ApiEndPointUrlOrKey = ImportAuthors.getImporteedAuthorsById;
   this.restService.callApi(keyData)
     .subscribe(sucessResponse => {     
       this.initializeFields(sucessResponse.imported_authors[0]);
                   
     });  
 } 
 public initializeFields(result:any) {
   this.viewImportedAuthorsFormGroup = new FormGroup({
    authors: new FormControl({value: result.id, disabled: true}),
    highest_qualification: new FormControl({value: result.highest_qualification, disabled: true}),
    mobile_number: new FormControl({value: result.mobile_number, disabled: true}),
    title: new FormControl({value: result.title, disabled: true}),
    sme: new FormControl({value: result.subject, disabled: true}),
    alternate_mobile_numner: new FormControl({value: result.alternate_mobile_number, disabled: true}),
    name: new FormControl({value: result.name, disabled: true}),
    experience: new FormControl({value: result.experience, disabled: true}),
    phone_number_office: new FormControl({value: result.phone_number, disabled: true}),
    organization_name: new FormControl({value: "", disabled: true}),
    language: new FormControl({value: result.language, disabled: true}),
    phone_number_home: new FormControl({value: result.phone_number, disabled: true}),
    department: new FormControl({value: result.department, disabled: true}),
    identity_type: new FormControl({value: result.identity_type, disabled: true}),
    email: new FormControl({value: result.email, disabled: true}),
    designation: new FormControl({value: result.designation, disabled: true}),
    identity_number: new FormControl({value: result.identity_number, disabled: true}),
    rating: new FormControl({value: result.rating, disabled: true})
  
   });    
   this.readThis(result.photo)
 }
 
readThis(inputValue: any): void {
this.image=inputValue;
}

}
