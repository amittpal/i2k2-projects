import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharedService } from 'src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/service/shared.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam, PaymentGateway, Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-manage-payment-gateway',
  templateUrl: './manage-payment-gateway.component.html',
  styleUrls: ['./manage-payment-gateway.component.scss']
})
export class ManagePaymentGatewayComponent implements OnInit {
  public paymentGatewayFormGroup: FormGroup;
  public registrationGuid: string;
  public paymentGatewayId: string;
  public registration_details: any;
  public payment_gateway_types: any;
  public payment_gateway_environments: any;
  public payment_gateway_details: any;
  public paytm_type = "";
  public payment_gateway_configuration: any;
  public selectedPaymentGatewayTypeId = "";

  public productionList = [
    {
      "id": 0,
      "name": "No"
    },
    {
      "id": 1,
      "name": "Yes"
    }
  ];


  constructor(
    private route: ActivatedRoute,
    private primaryHeader: PrimaryHeaderService,
    private SharedService: SharedService,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Payment Gateway");
    this.createForm();
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      this.paymentGatewayId = params['id'];

      //this.getRegistrationDetailsByGuid();
      this.SharedService.ExamId.next(this.registrationGuid); //Sharing Exam ID to other component
    }, error => {
      console.error('Error: ', error);

    });
    this.getPaymentTypeList();
    this.getPaymentEnvironmentList();
    this.getPaymentGatewayDetails();
  }

  createForm() {
    this.paymentGatewayFormGroup = new FormGroup({
      gatewayType: new FormControl("", Validators.required),
      gatewayCode: new FormControl("", Validators.required),
      gatewayName: new FormControl("", Validators.required),
      environment: new FormControl("", Validators.required),
      production: new FormControl("", Validators.required)
    });
  }

  getRegistrationDetailsByGuid() {
    var keyData = [
      {
        "name": "registrationGuid",
        "value": this.registrationGuid
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Registration.getRegistrationDetailsByGuid;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(successResponse => {

      this.registration_details = successResponse.registrations[0];

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getPaymentTypeList() {
    this.restService.ApiEndPointUrlOrKey = Registration.getPaymentGatewayTypeList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi().subscribe(successResponse => {
      this.payment_gateway_types = successResponse.payment_gateway_types;
      if (this.payment_gateway_types.length > 0) {
        this.paymentGatewayFormGroup.controls["gatewayType"].setValue(this.payment_gateway_types[0].id);
        this.selectedPaymentGatewayTypeId = this.payment_gateway_types[0].id

      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getPaymentEnvironmentList() {
    this.restService.ApiEndPointUrlOrKey = Registration.getPaymentGatewayEnvironmentList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi().subscribe(successResponse => {
      this.payment_gateway_environments = successResponse.payment_environments;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getPaymentGatewayDetails() {

    var keyData = [
      {
        "name": "id",
        "value": this.paymentGatewayId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Registration.getPaymentGatewayDetails;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.payment_gateway_details = successResponse.payment_gateway_details;
      this.payment_gateway_configuration = successResponse.payment_gateway_configuration;
      this.paymentGatewayFormGroup.patchValue({
        "gatewayType": this.payment_gateway_details["payment_gateway_type_id"] ? this.payment_gateway_details["payment_gateway_type_id"] : this.payment_gateway_types[0].id,
        "gatewayCode": this.payment_gateway_details["code"],
        "gatewayName": this.payment_gateway_details["name"],
        "environment": this.payment_gateway_details["payment_gateway_environment_id"] ? this.payment_gateway_details["payment_gateway_environment_id"] : "",
        "production": this.payment_gateway_details["production_gateway"]
      })

      if (this.payment_gateway_details["payment_gateway_type_id"]) {
        this.paymentGatewayFormGroup.controls["gatewayType"].disable();
        this.selectedPaymentGatewayTypeId = this.payment_gateway_details["payment_gateway_type_id"];
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onchangePaymentType(value) {
    this.paytm_type = value
  }

  submit(paymentGatewayConfigForm: FormGroup) {
    if (this.paymentGatewayFormGroup.valid === false || paymentGatewayConfigForm.valid === false) {
      let form = document.getElementById("paymentGatewayManageForm");
      form.classList.add("was-validated");
    }
    else {
      var keyData = [
        {
          name: "id",
          value: this.paymentGatewayId
        }
      ];

      let postParams = {
        "id": this.paymentGatewayId,
        "registration_guid": this.registrationGuid,
        "payment_gateway_type_id": this.paymentGatewayFormGroup.controls["gatewayType"].value,
        "code": this.paymentGatewayFormGroup.controls["gatewayCode"].value,
        "name": this.paymentGatewayFormGroup.controls["gatewayName"].value,
        "payment_gateway_environment_id": this.paymentGatewayFormGroup.controls["environment"].value,
        "production_gateway": Number(this.paymentGatewayFormGroup.controls["production"].value)
      }

      this.restService.ApiEndPointUrlOrKey = Registration.updateRegistrationPaymentGatewayDetail;
      this.restService.ApiEndPointMehod = RestMethods.Put;
      this.restService.HttpPostParams = postParams;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          this.addPaytmDetail(paymentGatewayConfigForm.getRawValue());
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.messageService.alert(errorResponse.httpErrorResponse);
          }
        }
      );

    }

  }
  submitPayment(){
    debugger
   if( this.selectedPaymentGatewayTypeId > '3') {
    if (!this.paymentGatewayFormGroup.valid){
      let form = document.getElementById("paymentGatewayManageForm");
      form.classList.add("was-validated");
    }
     else{
      var keyData = [
        {
          name: "id",
          value: this.paymentGatewayId
        }
      ];

      let postParams = {
        "id": this.paymentGatewayId,
        "registration_guid": this.registrationGuid,
        "payment_gateway_type_id": this.paymentGatewayFormGroup.controls["gatewayType"].value,
        "code": this.paymentGatewayFormGroup.controls["gatewayCode"].value,
        "name": this.paymentGatewayFormGroup.controls["gatewayName"].value,
        "payment_gateway_environment_id": this.paymentGatewayFormGroup.controls["environment"].value,
        "production_gateway": Number(this.paymentGatewayFormGroup.controls["production"].value)
      }

      this.restService.ApiEndPointUrlOrKey = Registration.updateRegistrationPaymentGatewayDetail;
      this.restService.ApiEndPointMehod = RestMethods.Put;
      this.restService.HttpPostParams = postParams;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          console.log(sucessResponse)
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              this.router.navigate(['registrations']);

            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.messageService.alert(errorResponse.httpErrorResponse);
          }
        }
      );
     }
    }
  }
  addPaytmDetail(paymentGatewayConfigForm) {

    if (this.selectedPaymentGatewayTypeId == "1") {
      let postPaytmConfigParams = {
        "registration_pay_gateway_id": this.paymentGatewayId,
        "pay_gateway_environment_id": this.paymentGatewayFormGroup.controls["environment"].value,
        "mid": paymentGatewayConfigForm.mid,
        "merchant_key": paymentGatewayConfigForm.merchant_key,
        "channel_id": paymentGatewayConfigForm.channel_id,
        "bank_name": paymentGatewayConfigForm.bank_name,
        "return_url": paymentGatewayConfigForm.return_url,
        "paytm_url": paymentGatewayConfigForm.payment_url,
        "app_url": "",
        "website": paymentGatewayConfigForm.website,
        "industry_type": "",
        "status": true
      }
      this.restService.ApiEndPointUrlOrKey = Registration.updatePaytmConfigDetail;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = postPaytmConfigParams;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi().subscribe(
        (sucessResponse) => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              this.router.navigate(['registrations']);

            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.messageService.alert(errorResponse.httpErrorResponse);
          }
        }
      );
    }

    else if (this.selectedPaymentGatewayTypeId == "2") {
      let postPaytmConfigParams = {
        "registration_pay_gateway_id": this.paymentGatewayId,
        "pay_gateway_environment_id": this.paymentGatewayFormGroup.controls["environment"].value,
        "merchant_key": paymentGatewayConfigForm.merchant_key,
        "merchant_salt": paymentGatewayConfigForm.merchant_salt,
        "auth_header": paymentGatewayConfigForm.auth_header,
        "return_url": paymentGatewayConfigForm.return_url,
        "payment_url": paymentGatewayConfigForm.payment_url,
        "status": true
      }
      this.restService.ApiEndPointUrlOrKey = Registration.updatePayumoneyConfigDetail;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = postPaytmConfigParams;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi().subscribe(
        (sucessResponse) => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              this.router.navigate(['registrations']);

            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.messageService.alert(errorResponse.httpErrorResponse);
          }
        }
      );
    }
 else if (this.selectedPaymentGatewayTypeId == "3") {
      let postPaytmConfigParams = {
        "registration_pay_gateway_id": this.paymentGatewayId,
        "pay_gateway_environment_id": this.paymentGatewayFormGroup.controls["environment"].value,
        "key_id": paymentGatewayConfigForm.key_id,
        "key_secret": paymentGatewayConfigForm.key_secret,
        "bank_name": paymentGatewayConfigForm.bank_name,
        "return_url": paymentGatewayConfigForm.return_url,
        "status": true
      }
      this.restService.ApiEndPointUrlOrKey = Registration.updateRazorPayConfigDetail;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = postPaytmConfigParams;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi().subscribe(
        (sucessResponse) => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              this.router.navigate(['registrations']);

            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.messageService.alert(errorResponse.httpErrorResponse);
          }
        }
      );
    }
  }

  reset() {
    this.paymentGatewayFormGroup.patchValue({
      "gatewayType": this.payment_gateway_details["payment_gateway_type_id"] ? this.payment_gateway_details["payment_gateway_type_id"] : this.payment_gateway_types[0].id,
      "gatewayCode": this.payment_gateway_details["code"],
      "gatewayName": this.payment_gateway_details["name"],
      "environment": this.payment_gateway_details["payment_gateway_environment_id"] ? this.payment_gateway_details["payment_gateway_environment_id"] : "",
      "production": this.payment_gateway_details["production_gateway"]
    })
  }

  onPaymentTypeChange(event: any) {
    if (event) {
      this.selectedPaymentGatewayTypeId = this.payment_gateway_types.find(p => p.id == event.target.value).id;
    }
  }
}