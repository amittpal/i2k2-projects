import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

@Component({
  selector: 'app-payumoney-view',
  templateUrl: './payumoney-view.component.html',
  styleUrls: ['./payumoney-view.component.scss']
})
export class PayumoneyViewComponent implements OnInit {

  public paytmGatewayForm: FormGroup;
  @Input() paymentGatewayConfigurationDetail;

  constructor(private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.initializeFields();
    this.primaryHeader.pageTitle.next("Payment Gateway");
  }

  ngOnChanges() {}

  initializeFields() {
    this.paytmGatewayForm = new FormGroup({
      merchant_key: new FormControl({ value: '', disabled: true }),
      merchant_salt: new FormControl({ value: '', disabled: true }),
      auth_header: new FormControl({ value: '', disabled: true }),
      payment_url: new FormControl({ value: '', disabled: true }),
      return_url: new FormControl({ value: '', disabled: true })     
    });
    if (this.paymentGatewayConfigurationDetail) {
      this.setinitializeFields();
    }
  }

  setinitializeFields() {
    this.paytmGatewayForm.patchValue({
      merchant_key: this.paymentGatewayConfigurationDetail.merchant_key,
      merchant_salt: this.paymentGatewayConfigurationDetail.merchant_salt,      
      auth_header: this.paymentGatewayConfigurationDetail.auth_header,
      payment_url: this.paymentGatewayConfigurationDetail.payment_url,
      return_url: this.paymentGatewayConfigurationDetail.return_url          
    });
  }

}
