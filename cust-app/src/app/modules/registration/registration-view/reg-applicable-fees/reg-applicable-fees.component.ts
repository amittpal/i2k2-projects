import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-reg-applicable-fees',
  templateUrl: './reg-applicable-fees.component.html',
  styleUrls: ['./reg-applicable-fees.component.scss']
})
export class RegApplicableFeesComponent implements OnInit {
  @Input() tabset: TabsetComponent;
  public feeSetupFormGroup: FormGroup;
  public feeTypeList = [];
  public fee_applicable_list = [];
  public registrationGuid: any;
  public orginalItems = [];
  public isDisable: boolean = false;
  public feeSetupList = [];
  public regTypeDetails: any;
  public isUpdateFlag: boolean = false;
  public registrationsFeeType: any;
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService) { }
  ngOnInit() {
    this.initializeFormFields();
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
    }, error => {
      console.error('Error: ', error);
    });
    this.getFeeTypeList();
    this.getRegSetupFeeByRegGuid();
  }

  initializeFormFields() {
    this.feeSetupFormGroup = new FormGroup({
      registration_fee_type_guid: new FormControl('', [Validators.required]),
    });

  }
  getRegSetupFeeByRegGuid() {
    let keydata = [{
      name: "registrationsGuid",
      value: this.registrationGuid
    }];
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegSetupFeeByRegGuid;
    this.restService.callApi(keydata).subscribe(successResponse => {
      if (successResponse.fee_list) {
        if (successResponse.fee_list[0].fee_setup_details) {
          this.registrationsFeeType = successResponse.registration_fee_type
          this.isUpdateFlag = true;
          this.feeSetupFormGroup.controls.registration_fee_type_guid.patchValue(successResponse.registration_fee_type_guid)
          this.fee_applicable_list = successResponse.fee_list
        } else {
          this.isUpdateFlag = false;
        }
      } else {
        this.isUpdateFlag = false;
      }
      console.log(successResponse);
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  public getFeeTypeList() {
    this.restService.ApiEndPointUrlOrKey = Registrations.getFeeTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.feeTypeList = successResponse.registation_fee_type;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onChangeTypeList(listTypeguid) {

    this.regTypeDetails = this.feeTypeList.filter(item => item.guid == listTypeguid)[0];
    debugger
    if (this.regTypeDetails.code === 'regtype') {
      this.getApplicableFeeList(listTypeguid, this.regTypeDetails);
    }
    else {
      this.getApplicableFeeList(listTypeguid, this.regTypeDetails);
    }
  }
  public getApplicableFeeList(feeTypeGuid, feeTypeDetails) {
    let keydata = [{
      name: "registrationsGuid",
      value: this.registrationGuid
    },
    {
      name: "feeTypeGuid",
      value: feeTypeGuid
    }];
    this.fee_applicable_list = [];
    this.restService.ApiEndPointUrlOrKey = Registrations.getApplicableFeeList;
    this.restService.callApi(keydata).subscribe(successResponse => {
      // successResponse.fee_list.forEach(element => {
      //   if (element.fee_setup_details) {
      //     this.isUpdateFlag = true;
      //   } else {
      //     this.isUpdateFlag = false;

      //     element['fee_setup_details'] = []
      //   }

      //   // if (feeTypeDetails.code == 'regtype') {
      //   //   element['reg_type_guid'] = element.guid;
      //   //   element['reg_type_name'] = element.name;
      //   // } else {
      //   //   element['exam_guid'] = element.guid;
      //   //   element['exam_name'] = element.name;
      //   // }
      // });
      this.fee_applicable_list = successResponse.fee_list;
      console.log(successResponse.fee_list);
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  onRegTypeFormSubmit() {
    if (this.feeSetupFormGroup.valid === false) {
      let form = document.getElementById("feeSetupFormGroup");
      form.classList.add("was-validated");
    } else if (this.feeSetupFormGroup.valid) {
      if (this.isUpdateFlag) {
        this.updateRgeType();
      } else {
        this.addRgeType();

      }
    }
  }
  addRgeType() {
    let params = this.getParams();
    let keydata = [{
      name: "registrationsGuid",
      value: this.registrationGuid
    }];
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.addFeeApplicableDetails;
    this.restService.ShowLoadingSpinner = true;
    this.restService.HttpPostParams = params;
    // alert('')
    this.restService.callApi(keydata)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.tabset.tabs[5].active = true;
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
          // this.messageService.alert(errorResponse);
        });
  }
  updateRgeType() {
    let params = this.getParams();
    let keydata = [{
      name: "registrationsGuid",
      value: this.registrationGuid
    }];
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.updateFeeApplicableDetails;
    this.restService.ShowLoadingSpinner = true;
    this.restService.HttpPostParams = params;
    // alert('Peding..')
    this.restService.callApi(keydata)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.tabset.tabs[5].active = true;
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
          // this.messageService.alert(errorResponse);
        });

  }
  getParams() {
    let params = {
      "registration_fee_type_guid": this.feeSetupFormGroup.value.registration_fee_type_guid,
      "registration_fee_type": this.regTypeDetails ? this.regTypeDetails.code : this.registrationsFeeType,
      "registration_guid": this.registrationGuid,
      "fee_list": this.fee_applicable_list
    };
    return params;
  }


  getUpdatedDetails(updatedDetails: any) {

    if (updatedDetails.exam_guid) {
      let itemIndex = this.fee_applicable_list.findIndex(i => i.exam_guid === updatedDetails.exam_guid);
      if (itemIndex > -1) {
        this.fee_applicable_list[itemIndex] = updatedDetails;
      }
    }
    if (updatedDetails.reg_type_guid) {
      let itemIndex = this.fee_applicable_list.findIndex(i => i.reg_type_guid === updatedDetails.reg_type_guid);
      if (itemIndex > -1) {
        this.fee_applicable_list[itemIndex] = updatedDetails;
      }
    }
  }

}


