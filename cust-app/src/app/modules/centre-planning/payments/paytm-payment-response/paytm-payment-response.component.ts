import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PaymentGateway } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-paytm-payment-response',
  templateUrl: './paytm-payment-response.component.html',
  styleUrls: ['./paytm-payment-response.component.scss']
})
export class PaytmPaymentResponseComponent implements OnInit {
  public paytmPaymentResponseFormGroup: any;
  public orderId: any;

  constructor(private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private http: HttpClient) {
    this.orderId = this.activeRoute.snapshot.params['orderId'];
  }

  ngOnInit() {
    this.primaryHeader.pageTitle.next('Paytm Payment Response');

    this.initializeForm();
    this.getPaymentPaytmRespose();

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
        "name": "orderId",
        "value": this.orderId
      }
    ]
    this.restService.ApiEndPointUrlOrKey = PaymentGateway.getPaymentPaytmResponse;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.reInitializeForm(sucessResponse.payment_responses[0]);
      }, errorResponse => {
        console.error('ERROR: ', errorResponse);

      });
  }
}

