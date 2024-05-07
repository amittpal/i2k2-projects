import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PaymentGateway } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import appRoutes from "../../../../../assets/config/appmodulesandroutes.json"
import { PaymentGetewayService } from '../paytm-payment-gateway/payment-geteway.service';

@Component({
  selector: 'app-paytm-payment-details',
  templateUrl: './paytm-payment-details.component.html',
  styleUrls: ['./paytm-payment-details.component.scss']
})
export class PaytmPaymentDetailsComponent implements OnInit {
  public paytmPaymentGatewayFormGroup: FormGroup;
  private appRoutesJson: any = {};
  public payment: any;
  public paymentdetails: any;
  public payment_gateway_Details: any;
  constructor(private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private paymentGetewayService: PaymentGetewayService,
    private router: Router) {
    this.primaryHeader.pageTitle.next("Paytm Payment Gateway");
  }

  ngOnInit() {
    this.paymentGetewayService.paymentBy.subscribe(value => {
      this.paymentdetails = value;
      this.initializeForm(value.payment_gateway_details)

    })
    this.getPaymentConfigDetails();
  }

  public initializeForm(paytmData) {
    this.paytmPaymentGatewayFormGroup = new FormGroup({
      callback_url: new FormControl(paytmData.params[0].callback_url),
      channel_id: new FormControl(paytmData.params[0].channel_id),
      customer_id: new FormControl(paytmData.params[0].customer_id),
      customer_name:new FormControl(paytmData.params[0].customer_name),
      email: new FormControl(paytmData.params[0].email),
      industry_type: new FormControl(paytmData.params[0].industry_type),
      mid: new FormControl(paytmData.params[0].mid),
      mobile: new FormControl(paytmData.params[0].mobile_number),
      order_id: new FormControl(paytmData.params[0].order_id),
      tax_amount: new FormControl(paytmData.params[0].tax_amount),
      web_site: new FormControl(paytmData.params[0].web_site),
      check_sum: new FormControl(paytmData.check_sum)
    })
  }

  getPaymentConfigDetails() {
    this.restService.ApiEndPointUrlOrKey = PaymentGateway.getPaymentDeatils;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    let obj = {
      exam_guid: "bc485a52-afd9-11ea-ad74-fa163e30423a",
      payment_environment_id: "1",
      payment_gateway_type_id: "1"
    }
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = obj;
    this.restService.callApi().subscribe(successResponse => {
      if (successResponse) {
        this.payment_gateway_Details = successResponse.payment_gateways[0];
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
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
      WEBSITE: paytmData.params[0].web_site,
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
    if (this.paymentdetails) {
      let data = this.paytmParams(this.paymentdetails.payment_gateway_details);
      this.paytmForm(data, this.paymentdetails.payment_gateway_details.payment_url)
      this.payment = this.paymentdetails.html;
      this.primaryHeader.pageTitle.next('Merchant Check Out Page');
      console.log(this.paymentdetails);
    }
  }

  public reset() {
    this.paytmPaymentGatewayFormGroup.reset()
  }
}

