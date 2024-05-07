import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-email-setup',
  templateUrl: './email-setup.component.html',
  styleUrls: ['./email-setup.component.scss']
})
export class EmailSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  @Input() qrBarCodeActiveFlag: string;
  emailSetupFormGroup: FormGroup;
  submitted = false;
  admitCardEmailSetupDetails: any = {};
  registrationGuid = "";
  emailDetails: any;

  // Data for Email's placeholder tags// Will recieve through api in future
  emailPlaceHolderTags: string[] = ['[FIRST_NAME]', '[CENTRE_CODE]', '[CENTRE_CITY]', '[CENTRE_NAME]', '[CENTRE_STATE]', '[CENTRE_ADDRESS1]', '[CENTRE_PIN]', '[ROLL_NUMBER]', '[CENTRE_ADDRESS2]'];

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.initializeForm();

    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      if (this.registrationGuid) {
        this.getEmailDetails(this.registrationGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });

  }

  // New instance of formgroup
  initializeForm() {
    this.emailSetupFormGroup = new FormGroup({
      smtp_server: new FormControl('', [Validators.required]),
      smtp_port: new FormControl('', [Validators.required, Validators.max(9999)]),
      sender_email: new FormControl('', [Validators.required, Validators.email]),
      sender_name: new FormControl('', [Validators.required]),
      verify_email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      email_sub_text: new FormControl('', [Validators.required]),
      email_body_template: new FormControl('', [Validators.required]),
      attach_admit_card: new FormControl('')
    });
  }


  // Initialize formcontrols of form group
  initializeFields(emailDetails: any) {
    if (emailDetails) {
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
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }

  // form submission
  onAddEmailSetupFormsubmit() {
    this.submitted = true;
    if (this.emailSetupFormGroup.valid) {
      let params = this.getParams();      
      this.restService.ApiEndPointUrlOrKey = AdmitCard.addAdmitCardEmailDetails;
      this.restService.ShowLoadingSpinner = true;
      this.restService.HttpPostParams = params;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              let nextTabIndex = (this.qrBarCodeActiveFlag == "2") ? 4 : 5;
              this.tabset.tabs[nextTabIndex].active = true;
            }
            else {
              this.messageService.hideModal();
            }
          });
        },
          errorResponse => {
            this.messageService.alert(errorResponse);
          });
    }
  }

  // create custom object to be sent to post api while form submission
  getParams() {
    let params =
    {
      "registration_guid": this.registrationGuid,
      exam_guid: "",
      "smtp": this.emailSetupFormGroup.get("smtp_server").value,
      "smtp_port": this.emailSetupFormGroup.get("smtp_port").value.toString(),
      "sender_email": this.emailSetupFormGroup.get("sender_email").value,
      "sender_name": this.emailSetupFormGroup.get("sender_name").value,
      "verify_email_id": this.emailSetupFormGroup.get("verify_email").value,
      "password": this.emailSetupFormGroup.get("password").value,
      "email_subject": this.emailSetupFormGroup.get("email_sub_text").value,
      "admit_card_attach": this.emailSetupFormGroup.get("attach_admit_card").value.toString() == "true" ? "1" : "0",
      "email_template": this.emailSetupFormGroup.get("email_body_template").value
    };

    return params;
  }

  // used when user double click on email placeholder to get the text
  tagDblclick(event) {
    let bodyText = this.emailSetupFormGroup.get('email_body_template').value;
    this.emailSetupFormGroup.controls["email_body_template"].setValue(bodyText == null ? "" : bodyText + " " + event.target.innerText);
    this.emailSetupFormGroup.controls["email_body_template"].markAsDirty();
  }

  reset() {
    if (this.admitCardEmailSetupDetails) {
      let emailDetails = this.admitCardEmailSetupDetails;
      this.emailSetupFormGroup.reset({
        smtp_server: emailDetails.smtp,
        smtp_port: emailDetails.smtp_port,
        sender_email: emailDetails.sender_email,
        sender_name: emailDetails.sender_name,
        verify_email: emailDetails.verify_email_id,
        password: emailDetails.password,
        email_sub_text: emailDetails.email_subject,
        attach_admit_card: emailDetails.admit_card_attach == "1" ? true : false,
        email_body_template: emailDetails.email_template
      });
    }
  }

}
