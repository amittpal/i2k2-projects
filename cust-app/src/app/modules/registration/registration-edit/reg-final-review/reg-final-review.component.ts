import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations, RegistrationsSetup } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-reg-final-review',
  templateUrl: './reg-final-review.component.html',
  styleUrls: ['./reg-final-review.component.scss']
})
export class RegFinalReviewComponent implements OnInit {

  @Input() tabset: TabsetComponent;
  public basicSetupFormGroup: FormGroup;
  public orginalItems = [];
  public regBasicsetupDetails: any;
  public isDisable: boolean = false;
  public registrationGuid: any;
  public fee_applicable_list = [];
  public feeSetupList = [];
  constructor(private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    this.initializeFormFields();
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      this.getData(params['registrationGuid']);
    }, error => {
      console.error('Error: ', error);
    });
    this.getFeeSetupMasterData();
    this.getRegSetupFeeByRegGuid();
  }
  public getFeeSetupMasterData() {
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getFeeSetupMasterList;
    this.restService.callApi().subscribe(successResponse => {
      this.feeSetupList = successResponse.fee_setup_details;

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  // public getFeeSetupMasterData() {
  //   this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getFeeSetupMasterList;
  //   this.restService.callApi().subscribe(successResponse => {
  //     this.feeSetupList = successResponse.fee_setup_details;
  //     // if (this.dataItems.fee_setup_details) {
  //     //   if (this.dataItems.fee_setup_details.length > 0) {
  //     //     let count = 0
  //     //     this.dataItems.fee_setup_details.forEach(element1 => {
  //     //       this.feeSetupList.forEach(element => {
  //     //         if (element.guid === element1.level1) {
  //     //           element1.level01 = element.name
  //     //         }
  //     //         if (element.guid === element1.level2) {
  //     //           element1.level02 = element.name
  //     //         }
  //     //         if (element.guid === element1.level3) {
  //     //           element1.level03 = element.name
  //     //         }
  //     //       });
  //     //       element1['line_num'] = ++count;
  //     //       let itemIndex = this.items.findIndex(i => i.line_num === element1.line_num);
  //     //       if (itemIndex > -1) {
  //     //         this.orginalItems[itemIndex] = element1;
  //     //         this.items[itemIndex] = element1;
  //     //       }
  //     //     });
  //     //   }
  //     // }
  //   }, errorResponse => {
  //     console.error('ERROR: ', errorResponse.message[0]);
  //   });
  // }
  getRegSetupFeeByRegGuid() {
    let keydata = [{
      name: "registrationsGuid",
      value: this.registrationGuid
    }];
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegSetupFeeByRegGuid;
    this.restService.callApi(keydata).subscribe(successResponse => {
      if (successResponse.fee_list) {
        successResponse.fee_list.forEach(element => {
          element.fee_setup_details.forEach(element1 => {
            this.feeSetupList.forEach(element => {
              if (element.guid === element1.level1) {
                element1.level01 = element.name
              }
              if (element.guid === element1.level2) {
                element1.level02 = element.name
              }
              if (element.guid === element1.level3) {
                element1.level03 = element.name
              }
            });
          });

        });
        this.fee_applicable_list = successResponse.fee_list
        console.log(successResponse);
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  getData(registrationGuid) {
    let keyData = [{
      name: 'registrationGuid',
      value: registrationGuid
    }]
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegBasicSetupDetailsByRegGuid;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.regBasicsetupDetails = successResponse;
      this.orginalItems = successResponse.exams;
      let count = 0
      if (successResponse.exams)
        successResponse.exams.forEach(element => {
          element['line_num'] = ++count;
          this.items.push(element);
        });
      if (successResponse.plan_status_code == 'InProgress') {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
      this.setupInitializeFormFields(successResponse);
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  setupInitializeFormFields(regBasicsetupDetails) {
    if (regBasicsetupDetails.plan_status_code == 'InProgress') {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
    this.basicSetupFormGroup = new FormGroup({
      guid: new FormControl(regBasicsetupDetails.guid, [Validators.required]),
      status: new FormControl(regBasicsetupDetails.status, [Validators.required]),
      code: new FormControl(regBasicsetupDetails.code, [Validators.required]),
      name: new FormControl(regBasicsetupDetails.name, [Validators.required]),
      registration_start_date: new FormControl(regBasicsetupDetails.registrations_setup_details.registration_start_date, Validators.required),
      registration_end_date: new FormControl(regBasicsetupDetails.registrations_setup_details.registration_end_date, Validators.required),
      fee_end_date: new FormControl(regBasicsetupDetails.registrations_setup_details.fee_end_date, Validators.required),
      required_payment: new FormControl(regBasicsetupDetails.registrations_setup_details.required_payment, Validators.required),
      url: new FormControl(regBasicsetupDetails.registrations_setup_details.url, [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')])
    });

  }
  initializeFormFields() {
    this.basicSetupFormGroup = new FormGroup({
      guid: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      registration_start_date: new FormControl('', Validators.required),
      registration_end_date: new FormControl('', Validators.required),
      fee_end_date: new FormControl('', Validators.required),
      required_payment: new FormControl('', Validators.required),
      url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')])
    });

  }


  onBasicSetupFormSubmit() {
    // if (this.basicSetupFormGroup.valid === false) {
    //   let form = document.getElementById("basicSetupFormGroup");
    //   form.classList.add("was-validated");
    // } else if (this.items.length == 0) {
    //   this.messageService.ok("Please add atleast on exam.");
    //   return false;

    // } else if (this.basicSetupFormGroup.valid) {
    // let params = this.getParams();
    let keyData = [{
      name: 'registrationsGuid',
      value: this.basicSetupFormGroup.value.guid
    }]
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.finlizeRegSetupDetails;
    this.restService.ShowLoadingSpinner = true;
    // this.restService.HttpPostParams = params;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            // this.tabset.tabs[1].active = true;
            this.router.navigate(['registrations']);
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
          // this.messageService.alert(errorResponse);
        });
    // }
  }
  getParams() {
    let params = {
      "guid": this.basicSetupFormGroup.get("guid").value,
      "code": this.basicSetupFormGroup.get("code").value,
      "name": this.basicSetupFormGroup.get("name").value,
      "status": this.basicSetupFormGroup.get("status").value,
      registrations_setup_details:
      {
        "required_payment": this.basicSetupFormGroup.get("required_payment").value,
        "registration_start_date": this.basicSetupFormGroup.get("registration_start_date").value,
        "registration_end_date": this.basicSetupFormGroup.get("registration_end_date").value,
        "fee_end_date": this.basicSetupFormGroup.get("fee_end_date").value,
        "url": this.basicSetupFormGroup.get("url").value
      },
      exams: this.items

    };
    return params;
  }
  public items = [];
  public lastSeenIdMax = 0;
  public itemCount = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public notFound: boolean = false;

  getUpdatedDetails(updatedDetails: any) {
    if (updatedDetails) {
      let itemIndex = this.items.findIndex(i => i.line_num === updatedDetails.line_num);
      if (itemIndex > -1) {
        this.items[itemIndex] = updatedDetails;
      }
    }
  }
  onAddRow() {
    if (this.items.length > 0) {
      let lastItem = this.items[this.items.length - 1];
      let item = {
        "line_num": lastItem.line_num + 1,
        "code": "",
        "name": "",
        "exam_guid": "",
      }
      this.items.push(item);
    }
    else {
      let item = {
        "line_num": 1,
        "code": "",
        "name": "",
        "exam_guid": "",
      }
      this.items.push(item);
    }
  }
  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }
  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (
        this.items[i].line_num === updatedItem.prodInfo.line_num
      ) {
        this.items[i] = updatedItem.prodInfo;
        break;
      }
    }
  }
  onClearRow() {
    this.items = [];
    this.items = Object.assign([], this.orginalItems);
  }


}


