import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { RegistrationsSetup,Registration, Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-publish-registration',
  templateUrl: './publish-registration.component.html',
  styleUrls: ['./publish-registration.component.scss']
})
export class PublishRegistrationComponent implements OnInit {

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
    private primaryHeaderService:PrimaryHeaderService,
    private router: Router) { }

  ngOnInit() {
    this.initializeFormFields();
    this.primaryHeaderService.pageTitle.next('Publish Registartion')
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
    let keyData = [{
      name: 'registrationsGuid',
      value: this.basicSetupFormGroup.value.guid
    }]
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ApiEndPointUrlOrKey = Registrations.publishRegSetupDetails;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.router.navigate(['registrations']);
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
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

  
}


