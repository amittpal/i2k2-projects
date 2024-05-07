import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

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
              private restService: GlobalRestService) { }

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
      reg_list_type_name:new  FormControl({value:'',disabled:true},[Validators.required]),
      code:new  FormControl({value:'',disabled:true},[Validators.required]),
      name: new FormControl({value: '', disabled: true},[Validators.required]),        
      exam_type: new FormControl({value: '', disabled: true},[Validators.required]),
      randomize_reg: new FormControl({value: '', disabled: true},[Validators.required]),      
      distribution_schedule: new FormControl({value: '0', disabled: true},[Validators.required]),            
      days_for_distribution: new FormControl({value: '', disabled: true},[Validators.required]),                       
      centre_map: new FormControl({value: '', disabled: true},[Validators.required]),
      distribution_method: new FormControl({value: '0', disabled: true},[Validators.required])
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
      getData(id: any) {
        var keyData = [
          {
          "name": "registrationGuid",
          "value": id
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
          reg_list_type_name:setupDetails.reg_list_type_name,
          code: setupDetails.code,
          name: setupDetails.name,
          exam_type: setupDetails.exam_type,
          randomize_reg: setupDetails.ramdomize_registration,
          distribution_schedule: setupDetails.admit_card_distribution_id,            
          days_for_distribution: setupDetails.days_for_distribution,            
          centre_map: setupDetails.show_map,
          distribution_method: setupDetails.distribution_method_id
        });
      }
    }
}
