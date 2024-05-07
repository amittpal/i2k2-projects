import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { TabsetComponent } from 'ngx-bootstrap';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-basic-setup',
  templateUrl: './basic-setup.component.html',
  styleUrls: ['./basic-setup.component.scss']
})
export class BasicSetupComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  public basicSetupFormGroup: FormGroup;
  submitted = false;
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
    this.getdistributionschedule();
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
      code: new FormControl({ value: '', disabled: true }, [Validators.required]),
      name: new FormControl({ value: '', disabled: true }, [Validators.required]),
      logo_img: new FormControl('', [Validators.required]),
      logo_img_visible: new FormControl(''),
      reg_list_type_name: new FormControl({ value: '', disabled: true }, [Validators.required]),
      // randomize_reg: new FormControl('', [Validators.required]),
      sign_img: new FormControl('', [Validators.required]),
      sign_img_visible: new FormControl(''),
      distribution_schedule: new FormControl('0', [Validators.required, Validators.min(1)]),
      days_for_distribution: new FormControl('', [Validators.required]),
      bg_img: new FormControl(''),
      bg_img_visible: new FormControl(''),
      centre_map: new FormControl('', [Validators.required]),
      distribution_method: new FormControl('0', [Validators.required, Validators.min(1)]),
      qr_barcode: new FormControl('', [Validators.required])
    });
  }

  //get distribution method data like sms,email or sms/email
  getdistributionmethod() {

    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardDistributionMethod;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.admitCardDistributionMethod = sucessResponse.admit_card_distribution_method;
        if (this.admitCardDistributionMethod.length == 1) {
          this.basicSetupFormGroup.controls['distribution_method'].patchValue(this.admitCardDistributionMethod[0].id);
        }
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
        if (this.admitCardDistributionSchedule.length == 1) {
          this.basicSetupFormGroup.controls['distribution_schedule'].patchValue(this.admitCardDistributionSchedule[0].id);
        }
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
        if (this.qrBarCode.length == 1) {
          this.basicSetupFormGroup.controls['qr_barcode'].patchValue(this.qrBarCode[0].id);
        }
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
        code: setupDetails.code,
        name: setupDetails.name,
        logo_img: setupDetails.logo_image,
        reg_list_type_name: setupDetails.reg_list_type_name,
        // randomize_reg: setupDetails.ramdomize_registration,
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

  // Form Submit
  onBasicSetupFormSubmit() {
    this.submitted = true;

    if (this.basicSetupFormGroup.valid) {
      let params = this.getParams();
      this.restService.ApiEndPointUrlOrKey = AdmitCard.updateAdmitCardBasicSetupDetails;
      this.restService.ShowLoadingSpinner = true;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.HttpPostParams = params;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.sendSmsEmailQrBarCodeDisableFlag(params.distribution_method_id, params.qr_barcode);
              this.tabset.tabs[1].active = true;
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

  // create object to be sent to api for form submission
  getParams() {
    let params =
    {
      "id": "",
      "exam_guid":"",
      "registration_guid": this.registrationGuid,
      "admit_card_distribution_id": this.basicSetupFormGroup.get("distribution_schedule").value.toString(),
      "show_map": this.basicSetupFormGroup.get("centre_map").value.toString(),
      "ramdomize_registration": "0",
      "days_for_distribution": this.basicSetupFormGroup.get("days_for_distribution").value,
      "distribution_method_id": this.basicSetupFormGroup.get("distribution_method").value.toString(),
      "logo_image": this.basicSetupFormGroup.get("logo_img").value.toString(),
      "signatory_image": this.basicSetupFormGroup.get("sign_img").value.toString(),
      "background_image": this.basicSetupFormGroup.get("bg_img").value.toString(),
      "qr_barcode": this.basicSetupFormGroup.get("qr_barcode").value.toString()
    };

    return params;
  }

  reset() {
    if (this.admitCardBasicSetupDetails) {
      let setupDetails = this.admitCardBasicSetupDetails;
      this.basicSetupFormGroup.reset({
        code: setupDetails.code,
        name: setupDetails.name,
        logo_img: setupDetails.logo_image,
        reg_list_type_name: setupDetails.reg_list_type_name,
        // randomize_reg: setupDetails.ramdomize_registration,
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

  //Set hidden control field with base64 converted string of image used for validation
  changeListener($event, firedFrom): void {
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {

      if (firedFrom == 'logo_image') {
        this.basicSetupFormGroup.controls["logo_img"].setValue(myReader.result);
        this.basicSetupFormGroup.controls["logo_img"].markAsDirty();
      }
      else if (firedFrom == 'sign_image') {
        this.basicSetupFormGroup.controls["sign_img"].setValue(myReader.result);
        this.basicSetupFormGroup.controls["logo_img"].markAsDirty();
      }
      else if (firedFrom == 'bg_image') {
        this.basicSetupFormGroup.controls["bg_img"].setValue(myReader.result);
        this.basicSetupFormGroup.controls["logo_img"].markAsDirty();
      }
    }
    myReader.readAsDataURL(file);
  }

  validateFile(name: String) {
    let extCont: any[] = ['pdf', 'jpeg', 'jpg', 'png']
    let Fileext: string = (name.substring(name.lastIndexOf('.') + 1)).toLowerCase();
    if (extCont.includes(Fileext)) {
      return true;
    }
    else {
      return false;
    }
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
