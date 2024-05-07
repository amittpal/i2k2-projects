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
  selector: 'app-paytm',
  templateUrl: './paytm.component.html',
  styleUrls: ['./paytm.component.scss']
})
export class PaytmComponent implements OnInit {

  public payment_gateway_Details: any
  public paytmGatewayForm: FormGroup;
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

  @Output() submitPaymentGatewayDetailEmitter = new EventEmitter();
  @Output() resetPaymentGatewayFormEmitter = new EventEmitter();
  @Input()  paymentGatewayConfigurationDetail;

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
      bank_name: new FormControl('', Validators.required),
      mid: new FormControl('', Validators.required),
      channel_id: new FormControl('', Validators.required),
      payment_url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')]),
      return_url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')]),
      merchant_key: new FormControl('', Validators.required),
      website: new FormControl('', Validators.required)
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

  formSubmit() {
    let paymentConfigureForm = this.paytmGatewayForm;
    if (this.paytmGatewayForm.valid === false) {
      let form = document.getElementById("paytmGatewayForm");
      form.classList.add("was-validated");
      this.submitPaymentGatewayDetailEmitter.emit(paymentConfigureForm);
    } else {
      this.submitPaymentGatewayDetailEmitter.emit(paymentConfigureForm);
    }
  }

  reset(){
    if (this.paymentGatewayConfigurationDetail) {
      this.setinitializeFields();
    }
    else{
      this.paytmGatewayForm.reset();
    }
    this.resetPaymentGatewayFormEmitter.emit();
  }

}
