import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-basic-setup',
  templateUrl: './basic-setup.component.html',
  styleUrls: ['./basic-setup.component.scss']
})
export class BasicSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  public basicSetupFormGroup: FormGroup;
  admitCardBasicSetupDetails: any = {};
  admitCardDistributionMethod: any = [];
  admitCardDistributionSchedule: any = [];
  qrBarCode: any = [];

  registrationGuid = "";
  examDetails: any;

  @Output() private exam_num = new EventEmitter<string>(); // Sends exam_number to parent tab
  @Output() private sms_email_qr_barCode_flag = new EventEmitter<{ smsEmailFlag: string, qrbarCodeFlag: string }>(); // Sends flag to parent tab in order to disable Sms and Email tab

  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {

    this.setupFormFields();
    this.getdistributionmethod();
    this.getdistributionschedule()
    this.getQrCodeDetails();

    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      if (this.registrationGuid) {
        this.getData(this.registrationGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });
  }

  //Create instance of new formgroup
  setupFormFields() {
    this.basicSetupFormGroup = new FormGroup({
      reg_list_type_name:new FormControl({ value: '', disabled: true }, [Validators.required]),
      code: new FormControl({ value: '', disabled: true }, [Validators.required]),
      name: new FormControl({ value: '', disabled: true }, [Validators.required]),
      logo_img: new FormControl({ value: '', disabled: true }, [Validators.required]),
      logo_img_visible: new FormControl({ value: '', disabled: true }),
      exam_type: new FormControl({ value: '', disabled: true }, [Validators.required]),
      randomize_reg: new FormControl({ value: '', disabled: true }, [Validators.required]),
      sign_img: new FormControl({ value: '', disabled: true }, [Validators.required]),
      sign_img_visible: new FormControl({ value: '', disabled: true }),
      distribution_schedule: new FormControl({ value: '0', disabled: true }, [Validators.required, Validators.min(1)]),
      days_for_distribution: new FormControl({ value: '', disabled: true }, [Validators.required]),
      bg_img: new FormControl({ value: '', disabled: true }),
      bg_img_visible: new FormControl({ value: '', disabled: true }),
      centre_map: new FormControl({ value: '', disabled: true }, [Validators.required]),
      distribution_method: new FormControl({ value: '0', disabled: true }, [Validators.required, Validators.min(1)]),
      qr_barcode: new FormControl({ value: '0', disabled: true }, [Validators.required])
    });
  }

  //get distribution method data like sms,email or sms/email
  getdistributionmethod() {

    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardDistributionMethod;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.admitCardDistributionMethod = sucessResponse.admit_card_distribution_method;
      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }

  getdistributionschedule() {

    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardDistributionSchedule;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.admitCardDistributionSchedule = sucessResponse.admit_card_distribution_method;
      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }

  getQrCodeDetails() {

    this.restService.ApiEndPointUrlOrKey = AdmitCard.getQrCodeDetails;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.qrBarCode = sucessResponse.qr_barcode;
      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }

  //initialize form controls
  initializeFields(setupDetails: any) {
    if (setupDetails) {
      this.basicSetupFormGroup.patchValue({
        reg_list_type_name:setupDetails.reg_list_type_name,
        code: setupDetails.code,
        name: setupDetails.name,
        logo_img: setupDetails.logo_image,
        exam_type: setupDetails.exam_type,
        randomize_reg: setupDetails.ramdomize_registration,
        sign_img: setupDetails.signatory_image,
        distribution_schedule: setupDetails.admit_card_distribution_id,
        days_for_distribution: setupDetails.days_for_distribution,
        bg_img: setupDetails.background_image,
        centre_map: setupDetails.show_map,
        distribution_method: setupDetails.distribution_method_id,
        qr_barcode: setupDetails.qr_barcode
      });
    }
  }

  // Get basic setup data through examid
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
        this.admitCardBasicSetupDetails = sucessResponse.admit_card_basic_details[0];
        this.initializeFields(sucessResponse.admit_card_basic_details[0]);
        this.sendSmsEmailQrBarCodeDisableFlag(sucessResponse.admit_card_basic_details[0].distribution_method_id, sucessResponse.admit_card_basic_details[0].qr_barcode);
        this.exam_num.emit(sucessResponse.admit_card_basic_details[0].exam_number);
      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
        }
      );
  }

  // openImgInNewTab(base64Img){
  //   var newTab = window.open();
  //   newTab.document.body.innerHTML = "<img src=" + base64Img + ">";
  // }

  //emits a flag to parent component to disable or enable sms and email tabset
  sendSmsEmailQrBarCodeDisableFlag(distributionMethodid, qrBarCodeFlag) {
    let flag = { "smsEmailFlag": distributionMethodid, "qrbarCodeFlag": qrBarCodeFlag };
    this.sms_email_qr_barCode_flag.emit(flag);
  }

}
