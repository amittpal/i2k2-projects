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
  public smsSetupFormGroup: FormGroup;
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
      console.error('Error: ', error);
    });
  }

  //new form group instance and its validation
  setupFormFields() {
    this.smsSetupFormGroup = new FormGroup({
      url: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern('^(https?):\/\/[^\s$.?#].[^\s]*$')]),
      key_uid: new FormControl({ value: '', disabled: true }, [Validators.required]),
      password: new FormControl({ value: '', disabled: true }, [Validators.required]),
      templete_text: new FormControl({ value: '', disabled: true }, [Validators.maxLength(160), Validators.required])
    });
  }

  // get sms setup details through api
  getSmsDetails(id: any) {
    var keyData = [
      {
        "name": "registrationGuid",
        "value": id
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
    this.charCount = templeteTxt.length;
  }
}
