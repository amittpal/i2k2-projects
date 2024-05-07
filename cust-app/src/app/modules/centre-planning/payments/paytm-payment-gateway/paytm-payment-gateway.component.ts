import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PaymentGateway } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import appRoutes from "../../../../../assets/config/appmodulesandroutes.json"
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { PaymentGetewayService } from './payment-geteway.service';

@Component({
  selector: 'app-paytm-payment-gateway',
  templateUrl: './paytm-payment-gateway.component.html',
  styleUrls: ['./paytm-payment-gateway.component.scss']
})
export class PaytmPaymentGatewayComponent implements OnInit,OnChanges {
  @Input() RegId:string;
  @Input() ExamGuid:string;
  
  public PaymentGatewayFormGroup: FormGroup;
  private appRoutesJson: any = {};
  public payment: any;
  public payment_gateway_Details: any;  
  constructor(private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private paymentGetewayService: PaymentGetewayService,
    private router: Router) {
    this.primaryHeader.pageTitle.next("Paytm Payment Gateway");
  }

  ngOnInit() {

    this.initializeForm()
    this.getPaymentInfo();
    // this.getPaymentConfigDetails();
  }
  ngOnChanges()
  {
    console.log(this.RegId)
    console.log(this.ExamGuid)
  }


  getPaymentInfo() {
    this.restService.ApiEndPointUrlOrKey = PaymentGateway.getPaymentPaymentInfo;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    let obj = {
      reg_id: this.RegId,
      // reg_id: "57",

    }
    var keyData = [
      {
        "name": "regId",
        "value": this.RegId,
        // "value": "57",
      }]
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = obj;
    this.restService.callApi(keyData).subscribe(successResponse => {
      if (successResponse) {
        console.log(successResponse.payment_gateway_types[0])
        this.setinitialFormData(successResponse.payment_gateway_types[0])
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public initializeForm() {
    this.PaymentGatewayFormGroup = new FormGroup({
      exam_guid: new FormControl(''),
      reg_id: new FormControl(''),
      payment_amount: new FormControl(''),
      industry_type: new FormControl(''),
      channel_id: new FormControl(''),
      email: new FormControl(''),
      mobile_number: new FormControl(''),
      name: new FormControl('')
    })
  }
  setinitialFormData(paymentinfo) {
    this.PaymentGatewayFormGroup = new FormGroup({
      exam_guid: new FormControl(this.ExamGuid),
      // exam_guid: new FormControl("bc485a52-afd9-11ea-ad74-fa163e30423a"),

      reg_id: new FormControl(paymentinfo.id),
      payment_amount: new FormControl(paymentinfo.fee_amount),
      // industry_type: new FormControl(),paymentinfo.fee_amount
      // channel_id: new FormControl(),
      industry_type: new FormControl('Retail'),
      channel_id: new FormControl('WEB'),
      email: new FormControl(paymentinfo.email),
      mobile_number: new FormControl(paymentinfo.mobile_number),
      name: new FormControl(paymentinfo.first_name +' '+ paymentinfo.last_name)
    })
  }
  public paytmParams(paytmData) {
    let paytm = {
      CALLBACK_URL: paytmData.params[0].callback_url,
      CHANNEL_ID: paytmData.params[0].channel_id,
      CUST_ID: paytmData.params[0].customer_id,
      EMAIL: paytmData.params[0].email,
      INDUSTRY_TYPE_ID: paytmData.params[0].industry_type,
      MID: paytmData.params[0].mid,
      MOBILE_NO: paytmData.params[0].mobile,
      ORDER_ID: paytmData.params[0].order_id,
      TXN_AMOUNT: paytmData.params[0].tax_amount,
      WEBSITE: paytmData.params[0].website,
      // payment_url: paytmData.payment_url,
      CHECKSUMHASH: paytmData.check_sum
    }
    return paytm;
  }

  public paytmForm(paydata, payment_url) {
    const my_form: any = document.createElement('form');
    my_form.name = 'paytm_form';
    my_form.method = 'post';
    my_form.action = payment_url;

    const myParams = Object.keys(paydata);
    for (let i = 0; i < myParams.length; i++) {
      const key = myParams[i];
      let my_tb: any = document.createElement('input');
      my_tb.type = 'hidden';
      my_tb.name = key;
      my_tb.value = paydata[key];
      my_form.appendChild(my_tb);
    };
    document.body.appendChild(my_form);
    my_form.submit();
  }

  public onFormSubmit() {
    // let httpPostParams = this.getParams();
    this.appRoutesJson = appRoutes;

    var keyData = [
      {
        "name": "examGuid",
        "value": this.ExamGuid,
        // "value":"bc485a52-afd9-11ea-ad74-fa163e30423a"
      }]
    this.restService.ApiEndPointUrlOrKey = PaymentGateway.paytmPaymentGateway;
    // this.restService.HttpPostParams = httpPostParams;
    this.restService.HttpPostParams = this.PaymentGatewayFormGroup.value;

    this.restService.callApi(keyData).subscribe(response => {
      if (response) {
        this.paymentGetewayService.paymentBy.next(response);

        let data = this.paytmParams(response.payment_gateway_details);
        this.paytmForm(data, response.payment_gateway_details.payment_url)
        this.payment = response.html;
        this.primaryHeader.pageTitle.next('Merchant Check Out Page');
      }
    }, error => {
      console.log(error.httpErrorResponse)
    })
  }

  public reset() {
    this.PaymentGatewayFormGroup.reset()
  }
}

