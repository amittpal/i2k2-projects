import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { RegistrationsSetup } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-basic-setup',
  templateUrl: './basic-setup.component.html',
  styleUrls: ['./basic-setup.component.scss']
})
export class BasicSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  public basicSetupFormGroup:FormGroup;  
  registrationSetupDetails:any={};
  examGuid="";
  constructor(private route: ActivatedRoute,
              private restService: GlobalRestService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.setupFormFields();
    this.route.params.subscribe((params: Params) => {
      this.examGuid=params['id'];
      if(this.examGuid)
      {
        this.getData(this.examGuid);
      }            
    }, error => {
      console.error('Error: ', error);
    });
  }

  setupFormFields()
  {
    this.basicSetupFormGroup = new FormGroup({
      code:new  FormControl({value:'',disabled:true},[Validators.required]),
      name: new FormControl({value: '', disabled: true},[Validators.required]),
      exam_type: new FormControl({value: '', disabled: true},[Validators.required]),
      registration_start_date:new FormControl('',Validators.required),
      registration_end_date:new FormControl('',Validators.required),
      fee_end_date:new FormControl('',Validators.required),
      required_payment:new FormControl({value: '', disabled: true},Validators.required),
      url:new  FormControl('',[Validators.required,Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')])
    });

  }

  initializeFields(setupDetails:any)
  {
    if(setupDetails)
    {
      this.basicSetupFormGroup.patchValue({
        code:setupDetails.code,
        name:setupDetails.name,
        exam_type:setupDetails.exam_type,
        registration_start_date:setupDetails.registration_start_date,
        registration_end_date:setupDetails.registration_end_date,
        fee_end_date:setupDetails.fee_end_date,
        required_payment:setupDetails.required_payment,
        url:setupDetails.url
      });
    }
  }
   
  getData(id: any) {
    var keyData = [
      {
      "name": "examGuid",
      "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getRegistrationsSetupDetailsByExamId;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => { 
        //console.log(sucessResponse); 
        this.registrationSetupDetails=sucessResponse.regsetup[0];
        this.initializeFields(sucessResponse.regsetup[0]);
        //this.getImportedCentres(sucessResponse.imported_centres[0].id);                
      },
      errorResponse=>{
        this.messageService.alert(errorResponse);
      }      
      );  
  } 
  
  onBasicSetupFormSubmit()
  {
    if(this.basicSetupFormGroup.valid)
    {    
      let params=this.getParams();
      if(this.registrationSetupDetails.registration_setup_id)
      {
        //updating if setup id is available
        var keyData = [
          {
          "name": "examGuid",
          "value":  this.examGuid
          }
        ];
        
        this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.updateRegistrationsSetupDetails;
        this.restService.ShowLoadingSpinner=true;
        this.restService.HttpPostParams=params;      
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => { 
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.tabset.tabs[1].active=true;               
              }
              else {
                this.messageService.hideModal();
              }
            });                 
          },
          errorResponse=>{
            this.messageService.alert(errorResponse);
          }  
          );  
      } 
      else
      {
        //adding if setup id is 0
        var keyData = [
          {
          "name": "examGuid",
          "value":  this.examGuid
          }
        ];        
        this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.addRegistrationsSetupDetails;
        this.restService.ShowLoadingSpinner=true;
        this.restService.HttpPostParams=params;      
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => { 
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.tabset.tabs[1].active=true;               
              }
              else {
                this.messageService.hideModal();
              }
            });                 
          },
          errorResponse=>{
            this.messageService.alert(errorResponse);
          });  
      } 
    
    }
  }

  getParams()
  {
    let params={registrationSetUpDetails:[
      {
        "required_payment":this.basicSetupFormGroup.get("required_payment").value,
        "registration_start_date":this.basicSetupFormGroup.get("registration_start_date").value,
        "registration_end_date":this.basicSetupFormGroup.get("registration_end_date").value,
        "fee_end_date":this.basicSetupFormGroup.get("fee_end_date").value,
        "exam_guid": this.examGuid,
        "url":this.basicSetupFormGroup.get("url").value
      }
    ]};
    return params;
  }

}
