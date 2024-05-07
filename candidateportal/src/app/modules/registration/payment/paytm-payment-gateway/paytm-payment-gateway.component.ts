import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import appRoutes from "../../../../../assets/config/appmodulesandroutes.json"
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { PaymentGetewayService } from './payment-geteway.service';
import { stringify } from '@angular/compiler/src/util';
import { WindowRefService } from '../../../../services/WindowRef/window-ref.service';
declare var RazorPay: any;
@Component({
  selector: 'app-paytm-payment-gateway',
  templateUrl: './paytm-payment-gateway.component.html',
  styleUrls: ['./paytm-payment-gateway.component.scss']
})
export class PaytmPaymentGatewayComponent implements OnInit {
  rzp1: any;
  CandidateGuid: string;
  registrationGuid: string;
  RegId: string;

  RazorpayParams = {};

  public OnlinePayment: boolean;
  public PaymentGatewayTypeId: string;
  public RazorPayOptions: string;
  public PaymentGatewayFormGroup: FormGroup;
  public PaymentGatewayOfflineFormGroup: FormGroup;
  private appRoutesJson: any = {};
  public payment: any;
  public payment_gateway_Details: any;
  constructor(private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private paymentGetewayService: PaymentGetewayService,
    private router: Router,
    private messageService: MessageService,
    private winRef: WindowRefService,
    private route: ActivatedRoute) {
    this.primaryHeader.pageTitle.next("Paytm Payment Gateway");
  }
  ngOnInit() {
    this.initializeForm();
    this.getCandiateInitialInfo();
  }

  getCandiateInitialInfo() {
    const candidateInfo = this.primaryHeader.getCanidateInfoFromStorage();
    this.CandidateGuid = candidateInfo.candidate_guid;
    this.registrationGuid = candidateInfo.registration_guid;
    this.RegId = candidateInfo.reg_id;
    this.getPaymentInfo();
  }

  getPaymentInfo() {
    this.restService.ApiEndPointUrlOrKey = Registration.getPaymentPaymentInfo;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    let obj = {
      candidate_guid: this.CandidateGuid,
      registration_guid: this.registrationGuid,
    }
    var keyData = [
      {
        "name": "candidateGuid",
        "value": this.CandidateGuid,
      }]
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = obj;
    this.restService.callApi(keyData).subscribe(successResponse => {
      if (successResponse) {

        this.setinitialFormData(successResponse.payment_gateway_details[0])
      }
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public initializeForm() {
    this.PaymentGatewayFormGroup = new FormGroup({
      registration_guid: new FormControl(''),
      reg_id: new FormControl(''),
      candidate_guid: new FormControl(''),
      payment_amount: new FormControl(''),
      industry_type: new FormControl(''),
      channel_id: new FormControl(''),
      email: new FormControl(''),
      mobile_number: new FormControl(''),
      name: new FormControl('')
    });
    this.PaymentGatewayOfflineFormGroup = new FormGroup({
      registration_guid: new FormControl(''),
      candidate_guid: new FormControl(''),
      payment_amount: new FormControl(''),
      payment_date: new FormControl(''),
      name: new FormControl(''),
      bank_name: new FormControl(''),
      challan_number: new FormControl(''),
      challan_date: new FormControl(''),
      challan_amount: new FormControl(''),
      cheque_dd_number: new FormControl(''),
      cheque_dd_amount: new FormControl(''),
      cheque_dd_date: new FormControl(''),
      mode_cheque_dd: new FormControl('Cheque'),
      payment_gateway_type_id: new FormControl('')
    })
  }
  public initRazorPay(): void {
    this.rzp1 = new this.winRef.nativeWindow.Razorpay(this.RazorpayParams);
    this.rzp1.open();
  }
  setinitialFormData(paymentinfo) {
    if (paymentinfo.payment_gateway_type_id === "3") {
      this.RazorpayParams = {
        "key": paymentinfo.key,
        "amount": (paymentinfo.fee_amount * 400), // 2000 paise = INR 20
        "name": "Razorpay",
        "order_id": paymentinfo.order_id,
        "description": paymentinfo.productinfo,
        "callback_url": paymentinfo.return_url,
        "image": "https://dev.cust.ixcheck.io/assets/images/logo_vcheck_green.png",
        // "handler": function (response){
        //     alert(response.razorpay_payment_id);
        //     alert(response.razorpay_order_id);
        //   alert(response.razorpay_signature)
        // },
        "prefill": {
          "name": paymentinfo.first_name,
          "email": paymentinfo.email,
          "contact": paymentinfo.mobile_number
        },
        "theme": {
          "color": "#D820B4"
        }
      };
    }
      //this.OnlinePayment = false
    this.OnlinePayment = paymentinfo.online_payment;
    //this.PaymentGatewayTypeId = 6
    this.PaymentGatewayTypeId = paymentinfo.payment_gateway_type_id;

    this.PaymentGatewayFormGroup = new FormGroup({
      registration_guid: new FormControl(this.registrationGuid),
      reg_id: new FormControl(this.RegId),
      candidate_guid: new FormControl(paymentinfo.candidate_guid),
      payment_amount: new FormControl(paymentinfo.fee_amount),
      industry_type: new FormControl('Retail'),
      channel_id: new FormControl('WEB'),
      email: new FormControl(paymentinfo.email),
      mobile_number: new FormControl(paymentinfo.mobile_number),
      name: new FormControl(paymentinfo.first_name + ' ' + paymentinfo.last_name)
    });

    this.PaymentGatewayOfflineFormGroup = new FormGroup({
      registration_guid: new FormControl(this.registrationGuid),
      candidate_guid: new FormControl(paymentinfo.candidate_guid),
      payment_amount: new FormControl(paymentinfo.fee_amount),
      payment_date: new FormControl(''),
      name: new FormControl(paymentinfo.first_name + ' ' + paymentinfo.last_name),
      bank_name: new FormControl(''),
      challan_number: new FormControl(''),
      challan_date: new FormControl(''),
      challan_amount: new FormControl(paymentinfo.fee_amount),
      cheque_dd_number: new FormControl(''),
      cheque_dd_amount: new FormControl(paymentinfo.fee_amount),
      cheque_dd_date: new FormControl(''),
      mode_cheque_dd: new FormControl('Cheque'),
      payment_gateway_type_id: new FormControl(this.PaymentGatewayTypeId)
    });
  }
  public paytmParams(paytmData) {
    let paytm = {
      CALLBACK_URL: paytmData.callback_url,
      CHANNEL_ID: paytmData.channel_id,
      CUST_ID: paytmData.customer_id,
      EMAIL: paytmData.email,
      INDUSTRY_TYPE_ID: paytmData.industry_type,
      MID: paytmData.mid,
      MOBILE_NO: paytmData.mobile,
      ORDER_ID: paytmData.order_id,
      TXN_AMOUNT: paytmData.tax_amount,
      WEBSITE: paytmData.website,
      // payment_url: paytmData.payment_url,
      CHECKSUMHASH: paytmData.check_sum
      // GaTEWAY_NAME:paytmData.params[0].gateway_name
    }
    return paytm;
  }
  public payUmoneyParams(payumoneyData) {
    let payumoney = {
      hash: payumoneyData.hash,
      txnid: payumoneyData.txnid,
      key: payumoneyData.key,
      amount: payumoneyData.amount,
      firstname: payumoneyData.firstname,
      email: payumoneyData.email,
      phone: payumoneyData.phone,
      productinfo: payumoneyData.productinfo,
      surl: payumoneyData.surl,
      furl: payumoneyData.furl,
      lastname: payumoneyData.lastname,
      address1: payumoneyData.address1,
      address2: payumoneyData.address2,
      city: payumoneyData.city,
      state: payumoneyData.state,
      country: payumoneyData.country,
      zipcode: payumoneyData.zipcode,
      udf1: payumoneyData.udf1,
      udf2: payumoneyData.udf2,
      udf3: payumoneyData.udf3,
      udf4: payumoneyData.udf4,
      udf5: payumoneyData.udf5,
      service_provider: payumoneyData.service_provider,
      pg: payumoneyData.pg,
    }
    return payumoney;
  }

  public paytmForm(paydata, payment_url) {
    const my_form: any = document.createElement('form');
    my_form.name = 'paytm_form';
    my_form.method = 'POST';
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
  public payUmoneyForm(paydata, payment_url) {
    const my_form: any = document.createElement('form');
    my_form.name = 'PostForm';
    my_form.method = 'POST';
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
        "name": "registrationGuid",
        "value": this.registrationGuid
      },
      {
        "name": "candidateGuid",
        "value": this.CandidateGuid
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Registration.paytmPaymentGateway;
    // this.restService.HttpPostParams = httpPostParams;
    this.restService.HttpPostParams = this.PaymentGatewayFormGroup.value;

    this.restService.callApi(keyData).subscribe(response => {
      if (response) {
        this.paymentGetewayService.paymentBy.next(response);
        if (response.payment_gateway_details.gateway_name === 'PAYTM') {
          let data = this.paytmParams(response.payment_gateway_details);
          this.paytmForm(data, response.payment_gateway_details.payment_url)
          this.payment = response.html;
          this.primaryHeader.pageTitle.next('Merchant Check Out Page');
        }
        else if (response.payment_gateway_details.gateway_name === 'PAYUMONEY') {
          let data = this.payUmoneyParams(response.payment_gateway_details);
          this.payUmoneyForm(data, response.payment_gateway_details.payment_url)
          this.payment = response.html;
          this.primaryHeader.pageTitle.next('Merchant Check Out Page');
        }
      }
    }, error => {
      console.log(error.httpErrorResponse)
    })
  }
  public SubmitOfflineForm() {

    let form = document.getElementById("PaymentGatewayOfflineForm");
    if (this.PaymentGatewayOfflineFormGroup.valid === false) {
      form.classList.add("was-validated");
    }
    else {
      var keyData = [
        {
          "name": "candidateGuid",
          "value": this.CandidateGuid
        }
      ]
      this.restService.ApiEndPointUrlOrKey = Registration.offlinePaymentAdd;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.HttpPostParams = this.PaymentGatewayOfflineFormGroup.value;

      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          if (sucessResponse) {
            console.log(sucessResponse);
            this.messageService.notify(sucessResponse);
            this.router.navigate(['/registration/exam/payment/view/orders']);
          }
        },
        (errorResponse) => {
          this.messageService.notify(errorResponse.httpErrorResponse);
          // this.router.navigate(['/dashboard']);
        }
      );
    }
  }
  public reset() {
    this.PaymentGatewayFormGroup.reset()
  }
}