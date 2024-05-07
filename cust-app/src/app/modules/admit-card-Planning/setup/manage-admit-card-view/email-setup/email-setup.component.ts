import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-email-setup',
  templateUrl: './email-setup.component.html',
  styleUrls: ['./email-setup.component.scss']
})
export class EmailSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  emailSetupFormGroup: FormGroup;
  admitCardEmailSetupDetails:any={};
  registrationGuid="";
  emailDetails:any;

  // Data for Email's placeholder tags// Will receive through api in future
  emailPlaceHolderTags : string[] = ['[TITLE_NAME]' , '[CENTRE_CODE]' , '[CENTRE_CITY]', '[FIRST_NAME]', '[CENTRE_NAME]', '[CENTRE_STATE]', '[LAST_NAME]', '[CENTRE_ADDRESS1]', '[CENTRE_PIN]', '[ROLL_NUMBER]', '[CENTRE_ADDRESS2]'];

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService) { }

  ngOnInit() {
    this.initializeForm();

    this.route.params.subscribe((params: Params) => {
      this.registrationGuid =params['registrationGuid'];
     if(this.registrationGuid)
     {
       this.getEmailDetails(this.registrationGuid);
     }            
   }, error => {
     console.error('Error: ', error);
   });

  }

// New instance of formgroup
  initializeForm() {    
      this.emailSetupFormGroup = new FormGroup({
        smtp_server: new FormControl({value:'',disabled:true},[Validators.required]),
        smtp_port: new FormControl({value:'',disabled:true},[Validators.required,Validators.max(9999)]),
        sender_email: new FormControl({value:'',disabled:true},[Validators.required,Validators.email]),
        sender_name: new FormControl({value:'',disabled:true},[Validators.required]),
        verify_email: new FormControl({value:'',disabled:true},[Validators.required,Validators.email]),
        password: new FormControl({value:'',disabled:true},[Validators.required]),
        email_sub_text: new FormControl({value:'',disabled:true},[Validators.required]),
        email_body_template: new FormControl({value:'',disabled:true},[Validators.required]),
        attach_admit_card: new FormControl({value:'',disabled:true})        
      });    
    }
  

// Initialize formcontrols of form group
    initializeFields(emailDetails:any)
    {
      if(emailDetails)
      {
        this.emailSetupFormGroup.patchValue({
          smtp_server: emailDetails.smtp,
          smtp_port: emailDetails.smtp_port,        
          sender_email: emailDetails.sender_email,
          sender_name: emailDetails.sender_name,   
          verify_email: emailDetails.verify_email_id,            
          password: emailDetails.password,            
          email_sub_text: emailDetails.email_subject,
          attach_admit_card: emailDetails.admit_card_attach == "0" ? false : true,          
          email_body_template: emailDetails.email_template
        });
      }
    }

    // Get email setup data throug api
    getEmailDetails(id: any) {
      var keyData = [
        {
        "name": "registrationGuid",
        "value": id
        }
      ];
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardEmailDetails;
      this.restService.callApi(keyData)
        .subscribe(successResponse => {          
          this.admitCardEmailSetupDetails = successResponse.admit_card_email_details[0];
          this.initializeFields(successResponse.admit_card_email_details[0]);           
        },
        errorResponse=>{
          //this.messageService.alert(errorResponse);
        }      
        );  
    }
}
