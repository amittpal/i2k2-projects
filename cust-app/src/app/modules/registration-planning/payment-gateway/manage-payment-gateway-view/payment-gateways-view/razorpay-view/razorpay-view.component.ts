import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
@Component({
  styleUrls: ['./razorpay-view.component.scss'],
  templateUrl: './razorpay-view.component.html',
  selector: 'app-razorpay-view',
})
export class RazorpayViewComponent implements OnInit {

  public razorpayForm: FormGroup;
  @Input() paymentGatewayConfigurationDetail;
  constructor(private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.createPayumoneyForm();
    this.primaryHeader.pageTitle.next("Payment Gateway");
  }

  createPayumoneyForm() {
    this.razorpayForm = new FormGroup({
      key_id: new FormControl({ value: '', disabled: true }),
      key_secret: new FormControl({ value: '', disabled: true }),
      bank_name: new FormControl({ value: '', disabled: true }),
      return_url: new FormControl({ value: '', disabled: true }),
    });

    if (this.paymentGatewayConfigurationDetail) {
      this.initializeFormFields();
    }
  }

  initializeFormFields() {
    this.razorpayForm.patchValue({
      key_id: this.paymentGatewayConfigurationDetail.key_id,
      key_secret: this.paymentGatewayConfigurationDetail.key_secret,
      bank_name: this.paymentGatewayConfigurationDetail.bank_name,
      return_url: this.paymentGatewayConfigurationDetail.return_url
    });
  }
}