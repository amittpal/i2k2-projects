import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registered } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {
public paymentsDetail: any = {};

  @Input() payments: any;

  constructor(private router: Router, private restService: GlobalRestService
  ) { }

  ngOnInit() {
    this.getPaymentsDetail(this.payments);
  }

  getPaymentsDetail(paymentData) {
    var keyData = [
      {
        "name": "registrationId",
        "value": paymentData.registration_guid
      },
      {
        "name": "guid",
        "value": paymentData.candidate_guid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Registered.getPaymentDetailByPaymentId;
    this.restService.callApi(keyData).subscribe((successResponse) => {
      this.paymentsDetail = successResponse.payments;
    });
  }

}
