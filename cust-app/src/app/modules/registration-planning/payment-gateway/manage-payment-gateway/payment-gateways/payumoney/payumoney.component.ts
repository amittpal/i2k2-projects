import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payumoney',
  templateUrl: './payumoney.component.html',
  styleUrls: ['./payumoney.component.scss']
})
export class PayumoneyComponent implements OnInit {

  public payumoneyGatewayForm: FormGroup;
  @Input()  paymentGatewayConfigurationDetail;
  @Output() submitPaymentGatewayDetailEmitter = new EventEmitter();
  @Output() resetPaymentGatewayFormEmitter = new EventEmitter();
  constructor() { }

  ngOnInit() {    
    this.createPayumoneyForm();
  }

 createPayumoneyForm() {
    this.payumoneyGatewayForm = new FormGroup({
      merchant_key: new FormControl("", Validators.required),
      merchant_salt: new FormControl("", Validators.required),
      auth_header: new FormControl("", Validators.required),
      payment_url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')]),
      return_url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')]),   
    });

    if (this.paymentGatewayConfigurationDetail) {
      this.initializeFormFields();     
    }
  }

  initializeFormFields()
  {    
    this.payumoneyGatewayForm.patchValue({    
      merchant_key: this.paymentGatewayConfigurationDetail.merchant_key,   
      merchant_salt: this.paymentGatewayConfigurationDetail.merchant_salt,
      auth_header: this.paymentGatewayConfigurationDetail.auth_header,
      payment_url: this.paymentGatewayConfigurationDetail.payment_url,
      return_url: this.paymentGatewayConfigurationDetail.return_url
         
    });
  }    


  formSubmit() {
    let paymentConfigureForm = this.payumoneyGatewayForm;
    if (this.payumoneyGatewayForm.valid === false) {
      let form = document.getElementById("payumoneyGatewayFrom");
      form.classList.add("was-validated");
      this.submitPaymentGatewayDetailEmitter.emit(paymentConfigureForm);
    } else {
      this.submitPaymentGatewayDetailEmitter.emit(paymentConfigureForm);
    }
  }

  reset(){
    if (this.paymentGatewayConfigurationDetail) {
      this.initializeFormFields();
    }
    else{
      this.payumoneyGatewayForm.reset();
    }
    this.resetPaymentGatewayFormEmitter.emit();
  }
}
