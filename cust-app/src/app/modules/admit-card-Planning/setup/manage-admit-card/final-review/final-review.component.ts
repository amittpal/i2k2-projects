import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.scss']
})
export class FinalReviewComponent implements OnInit {
  
  public finalReviewFormGroup:FormGroup;  

  admitCardFinalReviewSetupDetails:any={};
  admitCardDistributionMethod:any = [];
  admitCardDistributionSchedule:any = [];
  registrationGuid="";

  constructor(private route: ActivatedRoute, private router: Router,
              private restService: GlobalRestService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.setupFinalReviewFormFields();    
    this.getdistributionmethod();
    this.getdistributionschedule()
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid=params['registrationGuid'];
      if(this.registrationGuid)
      {
        this.getData(this.registrationGuid);
      }            
    }, error => {
      console.error('Error: ', error);
    });
  }

  setupFinalReviewFormFields()
  {
    this.finalReviewFormGroup = new FormGroup({
      code:new  FormControl({value:'',disabled:true},[Validators.required]),
      name: new FormControl({value: '', disabled: true},[Validators.required]),        
      reg_list_type_name: new FormControl({value: '', disabled: true},[Validators.required]),
      randomize_reg: new FormControl({value: '', disabled: true},[Validators.required]),      
      distribution_schedule: new FormControl({value: '0', disabled: true},[Validators.required]),            
      days_for_distribution: new FormControl({value: '', disabled: true},[Validators.required]),                       
      centre_map: new FormControl({value: '', disabled: true},[Validators.required]),
      distribution_method: new FormControl({value: '0', disabled: true},[Validators.required]),
      mobileNo: new FormControl(''),
      emailId: new FormControl('')

    });

  }

    //get distribution method data like sms,email or sms/email
    getdistributionmethod(){

      this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardDistributionMethod;
      this.restService.callApi()
        .subscribe(sucessResponse => { 
          this.admitCardDistributionMethod=sucessResponse.admit_card_distribution_method;
        },
        errorResponse=>{
          //this.messageService.alert(errorResponse);
        }      
        );  
    }
  
    getdistributionschedule(){
  
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardDistributionSchedule;
      this.restService.callApi()
        .subscribe(sucessResponse => {         
          this.admitCardDistributionSchedule=sucessResponse.admit_card_distribution_method;
        },
        errorResponse=>{
          //this.messageService.alert(errorResponse);
        }      
        );  
    }


      // Get final review data through examid
      getData(registrationGuid: any) {
        var keyData = [
          {
          "name": "registrationGuid",
          "value": registrationGuid
          }
        ];
        this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardBasicSetupDetailsByExamId;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => { 
            //console.log(sucessResponse); 
            this.admitCardFinalReviewSetupDetails=sucessResponse.admit_card_basic_details[0];
            this.initializeFields(sucessResponse.admit_card_basic_details[0]);
          },
          errorResponse=>{
            //this.messageService.alert(errorResponse);
          }      
          );  
      } 


    //initialize form controls
    initializeFields(setupDetails:any)
    {
      if(setupDetails)
      {
        this.finalReviewFormGroup.patchValue({
          code: setupDetails.code,
          name: setupDetails.name,
          reg_list_type_name:setupDetails.reg_list_type_name,
          exam_type: "",
          randomize_reg: setupDetails.ramdomize_registration,
          distribution_schedule: setupDetails.admit_card_distribution_id,            
          days_for_distribution: setupDetails.days_for_distribution,            
          centre_map: setupDetails.show_map,
          distribution_method: setupDetails.distribution_method_id
        });
      }
    }

  reset(){
    
  }

  // form submission
  onFinalReviewFormSubmit(){
    let id = this.registrationGuid;
    if(this.finalReviewFormGroup.valid && id)
    {    
      var keyData = [
        {
        "name": "registrationGuid",
        "value": id
        }
      ];
      this.restService.ApiEndPointUrlOrKey = AdmitCard.finalizeAdmitCard;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {           
          this.messageService
            .okRedirectModal(sucessResponse, "SUCCESS", "Go to Main list")
            .subscribe(result => {
              if (result == true) {
                // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(["/admitcard/list"]);
              } else {
                // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
          
        },
        errorResponse=>{
          //this.messageService.alert(errorResponse);
        }      
        );  
    }
  }


}
