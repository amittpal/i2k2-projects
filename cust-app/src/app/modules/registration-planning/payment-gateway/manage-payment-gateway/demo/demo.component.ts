import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { SharedService } from 'src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/service/shared.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PaymentGateway } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-payment-gateway-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit, OnChanges {
  public payment_gateway_Details: any
  public demoPaymentFormGroup: FormGroup;
  public _paymentTypeId: any;
  public _registrationGuid: any;
  @Input() get paymentTypeId() {
    return this._paymentTypeId;
  }
  set paymentTypeId(paymentTypeId: any) {
    this._paymentTypeId = paymentTypeId;
  }
  @Input() get registrationGuid() {
    return this._registrationGuid;
  }
  set registrationGuid(flag: any) {
    this._registrationGuid = flag;
  }
  constructor(private route: ActivatedRoute,
     private messageService: MessageService,
     private primaryHeader: PrimaryHeaderService,
     private SharedService: SharedService,
     private restService: GlobalRestService,
     private router: Router
  ) { }

  ngOnInit() {
    this.initializeFields()
    this.primaryHeader.pageTitle.next("Payment Gateway");
  }
  ngOnChanges() {    
    if (this._paymentTypeId && this._registrationGuid) {
      this.getPaymentDeatils();
      this.initializeFields();
    } 
  }
  public initializeFields() {
    this.demoPaymentFormGroup = new FormGroup({
      id: new FormControl(''),
      registration_guid: new FormControl(''),
      payment_gateway_type_id: new FormControl(this._paymentTypeId),
      payment_environment_id: new FormControl("1"),
      mid: new FormControl(''),
      merchant_key: new FormControl(''),
      channel_id: new FormControl(''),
      bank_name: new FormControl(''),
      return_url: new FormControl(''),
      payment_url: new FormControl(''),
      website: new FormControl(''),
      status: new FormControl('1'),
    });
  }
  public setinitializeFields(demopaymentDetails) {
    this.demoPaymentFormGroup = new FormGroup({
      id: new FormControl(demopaymentDetails.id),
      registration_guid: new FormControl(demopaymentDetails.registration_guid),
      payment_gateway_type_id: new FormControl(demopaymentDetails.payment_gateway_type_id),
      payment_environment_id: new FormControl(demopaymentDetails.payment_environment_id),
      mid: new FormControl(demopaymentDetails.mid),
      merchant_key: new FormControl(demopaymentDetails.merchant_key),
      channel_id: new FormControl(demopaymentDetails.channel_id),
      bank_name: new FormControl(demopaymentDetails.bank_name),
      return_url: new FormControl(demopaymentDetails.return_url),
      payment_url: new FormControl(demopaymentDetails.payment_url),
      website: new FormControl(demopaymentDetails.web_site),
      status: new FormControl(demopaymentDetails.status),
    });
  }

  getPaymentDeatils() {
    this.restService.ApiEndPointUrlOrKey = PaymentGateway.getPaymentDeatils;
    //this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    let obj = {
      registration_guid: this._registrationGuid,
      payment_gateway_type_id: this._paymentTypeId,
      payment_environment_id: "1"
    }
    this.restService.ApiEndPointMehod = RestMethods.Post;    
    this.restService.HttpPostParams = obj;
    this.restService.callApi().subscribe(successResponse => {
      if (successResponse) {        
        this.payment_gateway_Details = successResponse.payment_gateways[0];
        this.setinitializeFields(this.payment_gateway_Details);
      }
    });
  }
  formSubmit() {
    if (this.demoPaymentFormGroup.valid === false) {
      let form = document.getElementById("demoPaymentGatewayForm");
      form.classList.add("was-validated");
    } else {
      this.addPaymentGatewayInfo();
    }
  }
  addPaymentGatewayInfo() {
    var keyData = [
      {
        name: "registrationGuid",
        value: this._registrationGuid,
      }
    ];
    this.restService.ApiEndPointUrlOrKey = PaymentGateway.addPaymentGatewayInfo;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.demoPaymentFormGroup.controls.registration_guid.setValue(this._registrationGuid)
    this.restService.HttpPostParams = this.demoPaymentFormGroup.value;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) { // OK = true for redirection
            this.messageService.hideModal();           
            this.router.navigate(['registrations']); 
            // this.nextTab.emit(1); // Select next tab
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
