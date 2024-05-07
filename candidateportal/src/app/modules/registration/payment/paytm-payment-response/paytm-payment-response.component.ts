import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';

import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-paytm-payment-response',
  templateUrl: './paytm-payment-response.component.html',
  styleUrls: ['./paytm-payment-response.component.scss']
})
export class PaytmPaymentResponseComponent implements OnInit {
  public paytmPaymentResponseFormGroup: any;
  public OnlinePayment: number;
  public paymentGatewayTypeId: number;
  public CandidateGuid: string = "";
  public isUserLoggedIn: boolean = false;
  public transactionList = [];

  constructor(private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
    private primaryHeaderService: PrimaryHeaderService) {
  }

  ngOnInit() {
    this.primaryHeader.pageTitle.next('Paytm Payment Response');
    this.checkUserLoginStatus();
    this.initializeForm();
    this.getCandiateInitialInfo();
  }

  checkUserLoginStatus() {
    this.primaryHeaderService.userLoginStatus.subscribe(value => {
      if (value === true || localStorage.getItem('accessToken')) {
        this.isUserLoggedIn = true;
      }
      else {
        this.isUserLoggedIn = false;
      }
    })
  }
  public initializeForm() {
    this.paytmPaymentResponseFormGroup = new FormGroup({
      id: new FormControl(),
      order_id: new FormControl(),
      txn_amount: new FormControl(),
      response_code: new FormControl(),
      response_msg: new FormControl(),
      payment_mode: new FormControl(),
      txn_date: new FormControl(),
      currency: new FormControl(),
      gateway_name: new FormControl(),
      bank_txn_id: new FormControl(),
      bank_name: new FormControl(),
      txn_status: new FormControl(),
    })
  }
  public reInitializeForm(responsPaymentdata) {
    this.paytmPaymentResponseFormGroup = new FormGroup({
      id: new FormControl(responsPaymentdata.id),
      order_id: new FormControl(responsPaymentdata.order_id),
      txn_amount: new FormControl(responsPaymentdata.txn_amount),
      response_code: new FormControl(responsPaymentdata.response_code),
      response_msg: new FormControl(responsPaymentdata.response_msg),
      payment_mode: new FormControl(responsPaymentdata.payment_mode),
      txn_date: new FormControl(responsPaymentdata.txn_date),
      currency: new FormControl(responsPaymentdata.currency),
      gateway_name: new FormControl(responsPaymentdata.gateway_name),
      bank_txn_id: new FormControl(responsPaymentdata.bank_txn_id),
      bank_name: new FormControl(responsPaymentdata.bank_name),
      txn_status: new FormControl(responsPaymentdata.txn_status),
    });
  }
  public getPaymentPaytmRespose() {
    var keyData = [
      {
        "name": "candidateGuid",
        "value": this.CandidateGuid
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Registration.getPaymentPaytmResponse;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        if (sucessResponse) {
          this.paymentGatewayTypeId = sucessResponse.payment_response[0].payment_gateway_type_id;
          this.OnlinePayment = sucessResponse.payment_response[0].online_payment;
          this.transactionList = sucessResponse.payment_response;
        }

      }, errorResponse => {
        console.error('ERROR: ', errorResponse);

      });
  }

  getCandiateInitialInfo() {

    const candidateInfo = this.primaryHeader.getCanidateInfoFromStorage();
    this.CandidateGuid = candidateInfo.candidate_guid;
    this.getPaymentPaytmRespose();

  }

  downloadPaymentDetailAsTextFile(transactionDetail: any) {
    // This variable stores all the data.
    let data =
      '\r Name: ' + transactionDetail.first_name + " " + transactionDetail.last_name + ' \r\n ' +
      'Email: ' + transactionDetail.email + ' \r\n ' +
      'Address: ' + transactionDetail.address + ", " + transactionDetail.city + ", " + transactionDetail.states + ", " + transactionDetail.pincode + ' \r\n ' +
      'Mobile Number: ' + transactionDetail.mobile_number + ' \r\n ' +
      'Exam Code: ' + transactionDetail.exam_code + ' \r\n ' +
      'Exam Name: ' + transactionDetail.exam_name + ' \r\n ' +
      'Transaction Id: ' + transactionDetail.order_id + ' \r\n ' +
      'Candidate Id: ' + transactionDetail.candidate_guid + ' \r\n ' +
      'Bank Transaction Id: ' + transactionDetail.bank_txn_id + ' \r\n ' +
      'Amount:	' + transactionDetail.txn_amount + ' \r\n ' +
      'Response Code: ' + transactionDetail.response_code + ' \r\n ' +
      'Response Message: ' + transactionDetail.response_msg + ' \r\n ' +
      'Payment Mode:	' + transactionDetail.payment_mode + ' \r\n ' +
      'Transaction Date:	' + transactionDetail.txn_date + ' \r\n ' +
      'Currency:	' + transactionDetail.currency + ' \r\n ' +
      'Bank Name: ' + transactionDetail.bank_name + ' \r\n ' +
      'Status: ' + transactionDetail.txn_status + ' \r\n ' +
      'Gateway Name:	' + transactionDetail.gateway_name;

    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'transaction-' + transactionDetail.bank_txn_id + '' + '.txt';	   // The file to save the data.

    let newLink = document.createElement("a");
    newLink.download = sFileName;
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);

    newLink.click();
  }
}