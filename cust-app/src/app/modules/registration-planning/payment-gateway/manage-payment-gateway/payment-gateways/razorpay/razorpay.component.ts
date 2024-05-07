import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.scss']
})
export class RazorpayComponent implements OnInit {

  public razorpayForm: FormGroup;
  @Input()  paymentGatewayConfigurationDetail;
  @Output() submitPaymentGatewayDetailEmitter = new EventEmitter();
  @Output() resetPaymentGatewayFormEmitter = new EventEmitter();
  constructor() { }

  ngOnInit() {    
    this.createPayumoneyForm();
  }

 createPayumoneyForm() {
    this.razorpayForm = new FormGroup({
      key_id: new FormControl("", Validators.required),
      key_secret: new FormControl("", Validators.required),
      bank_name: new FormControl("", Validators.required),
      return_url: new FormControl('', [Validators.required, Validators.pattern('^(https?):\/\/[^\\s$.?#].[^\\s]*$')]),   
    });

    if (this.paymentGatewayConfigurationDetail) {
      this.initializeFormFields();     
    }
  }

  initializeFormFields()
  {    
    this.razorpayForm.patchValue({    
      key_id: this.paymentGatewayConfigurationDetail.key_id,   
      key_secret: this.paymentGatewayConfigurationDetail.key_secret,
      bank_name: this.paymentGatewayConfigurationDetail.bank_name,
      return_url: this.paymentGatewayConfigurationDetail.return_url
         
    });
  }    


  formSubmit() {
    let paymentConfigureForm = this.razorpayForm;
    if (this.razorpayForm.valid === false) {
      let form = document.getElementById("razorpayForm");
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
      this.razorpayForm.reset();
    }
    this.resetPaymentGatewayFormEmitter.emit();
  }
}