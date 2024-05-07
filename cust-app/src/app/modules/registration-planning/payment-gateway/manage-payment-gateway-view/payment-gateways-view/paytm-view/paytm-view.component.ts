import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { SharedService } from 'src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/service/shared.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PaymentGateway } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-paytm-view',
  templateUrl: './paytm-view.component.html',
  styleUrls: ['./paytm-view.component.scss']
})
export class PaytmViewComponent implements OnInit {

  public payment_gateway_Details: any
  public paytmGatewayForm: FormGroup;
  @Input() paymentGatewayConfigurationDetail;

  constructor(private route: ActivatedRoute, private messageService: MessageService,
    private primaryHeader: PrimaryHeaderService, private SharedService: SharedService, private restService: GlobalRestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeFields();
    this.primaryHeader.pageTitle.next("Payment Gateway");
  }

  ngOnChanges() {

  }

  public initializeFields() {
    this.paytmGatewayForm = new FormGroup({
      bank_name: new FormControl({ value: '', disabled: true }),
      mid: new FormControl({ value: '', disabled: true }),
      channel_id: new FormControl({ value: '', disabled: true }),
      payment_url: new FormControl({ value: '', disabled: true }),
      return_url: new FormControl({ value: '', disabled: true }),
      merchant_key: new FormControl({ value: '', disabled: true }),
      website: new FormControl({ value: '', disabled: true })
    });
    if (this.paymentGatewayConfigurationDetail) {
      this.setinitializeFields();
    }
  }

  public setinitializeFields() {
    this.paytmGatewayForm.patchValue({
      bank_name: this.paymentGatewayConfigurationDetail.bank_name,
      mid: this.paymentGatewayConfigurationDetail.mid,
      channel_id: this.paymentGatewayConfigurationDetail.channel_id,
      payment_url: this.paymentGatewayConfigurationDetail.paytm_url,
      return_url: this.paymentGatewayConfigurationDetail.return_url,
      merchant_key: this.paymentGatewayConfigurationDetail.merchant_key,
      website: this.paymentGatewayConfigurationDetail.website
    });
  }

}
