import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmPaymentDetailsComponent } from './paytm-payment-details.component';

describe('PaytmPaymentDetailsComponent', () => {
  let component: PaytmPaymentDetailsComponent;
  let fixture: ComponentFixture<PaytmPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
