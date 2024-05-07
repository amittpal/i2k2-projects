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
  selector: 'app-manage-payment-gateway-view',
  templateUrl: './manage-payment-gateway-view.component.html',
  styleUrls: ['./manage-payment-gateway-view.component.scss']
})
export class ManagePaymentGatewayViewComponent implements OnInit {

  public paymentGatewayFormGroup: FormGroup;
  public registrationGuid: string;
  public paymentGatewayId: string;
  public registration_details: any;
  public payment_gateway_types: any;
  public payment_gateway_environments: any;
  public payment_gateway_details: any;
  public paytm_type = "";
  public payment_gateway_configuration: any;
  selectedPaymentGatewayTypeId: any;
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

  public createForm() {
    this.paymentGatewayFormGroup = new FormGroup({
      gatewayType: new FormControl({ value: '', disabled: true }),
      gatewayCode: new FormControl({ value: '', disabled: true }),
      gatewayName: new FormControl({ value: '', disabled: true }),
      environment: new FormControl({ value: '', disabled: true }),
      production: new FormControl({ value: '', disabled: true })
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
}