import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-sms-setup',
  templateUrl: './sms-setup.component.html',
  styleUrls: ['./sms-setup.component.scss']
})
export class SmsSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  @Input() smsEmailActiveFlag: string;
  @Input() qrBarCodeActiveFlag: string;
  public smsSetupFormGroup: FormGroup;
  submitted = false;
  admitCardSmsSetupDetails: any = {};
  charCount: number = 0;
  registrationGuid = "";
  // Data for Sms's placeholder tags// Will receive through api in future
  smsPlaceHolderTags: string[] = ['[FIRST_NAME]', '[CENTRE_CODE]', '[CENTRE_CITY]', '[CENTRE_NAME]', '[CENTRE_STATE]', '[CENTRE_ADDRESS1]', '[CENTRE_PIN]', '[ROLL_NUMBER]', '[CENTRE_ADDRESS2]'];

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {

    this.setupFormFields();

    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      if (this.registrationGuid) {
        this.getSmsDetails(this.registrationGuid);
      }
    }, error => {
      //console.error('Error: ', error);
    });
  }

  //new form group instance and its validation
  setupFormFields() {
    this.smsSetupFormGroup = new FormGroup({
      url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')]),
      key_uid: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      templete_text: new FormControl('', [Validators.maxLength(160), Validators.required])
    });
  }

  // get sms setup details through api
  getSmsDetails(registrationGuid: any) {
    var keyData = [
      {
        "name": "registrationGuid",
        "value": registrationGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardSmsDetails;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        //console.log(sucessResponse); 
        this.admitCardSmsSetupDetails = sucessResponse.admit_card_sms_details[0];
        this.initializeFields(sucessResponse.admit_card_sms_details[0]);
        this.countTextChar(sucessResponse.admit_card_sms_details[0].template)
      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }

  // initialize the form controls fields
  initializeFields(smsDetails: any) {
    if (smsDetails) {
      this.smsSetupFormGroup.patchValue({
        url: smsDetails.url,
        key_uid: smsDetails.userid,
        password: smsDetails.password,
        templete_text: smsDetails.template
      });
    }
  }

  // count length of the text onkey up
  countTextChar(templeteTxt) {
    if (templeteTxt != undefined)
      this.charCount = templeteTxt.length;
  }

  // form submission
  onSMSSetupFormSubmit() {
    this.submitted = true;
    if (this.smsSetupFormGroup.valid) {
      let params = this.getParams();
      this.restService.ApiEndPointUrlOrKey = AdmitCard.addAdmitCardSmsDetails;
      this.restService.ShowLoadingSpinner = true;
      this.restService.HttpPostParams = params;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();

              let nextTabIndex = (this.smsEmailActiveFlag == "2" || this.smsEmailActiveFlag == "3") ? 3 : (this.qrBarCodeActiveFlag == "2") ? 4 : 5;
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


  // create custom object to be sent to api while form submission
  getParams() {
    let params =
    {
      "exam_guid": this.registrationGuid,
      "registration_guid": this.registrationGuid,
      "url": this.smsSetupFormGroup.get("url").value,
      "userid": this.smsSetupFormGroup.get("key_uid").value,
      "password": this.smsSetupFormGroup.get("password").value,
      "template": this.smsSetupFormGroup.get("templete_text").value,
      "admit_card_distribution_id": "1" // Later on this property will be deleted
    };

    return params;
  }

  reset() {
    if (this.admitCardSmsSetupDetails) {
      let smsDetails = this.admitCardSmsSetupDetails;
      this.smsSetupFormGroup.reset({
        url: smsDetails.url,
        key_uid: smsDetails.userid,
        password: smsDetails.password,
        templete_text: smsDetails.template
      })

      this.countTextChar(smsDetails.template)
    }
  }

  // used when user double click on sms placeholder to get the text
  tagDblclick(event) {
    let bodyText = this.smsSetupFormGroup.get('templete_text').value;
    this.smsSetupFormGroup.controls["templete_text"].setValue(bodyText == null ? "" : bodyText + " " + event.target.innerText);
    this.smsSetupFormGroup.controls["templete_text"].markAsDirty();
  }

}
