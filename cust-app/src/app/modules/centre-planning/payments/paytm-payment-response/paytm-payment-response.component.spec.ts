import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmpaymentResponseComponent } from './paytm-payment-response.component';

describe('PaytmpaymentResponseComponent', () => {
  let component: PaytmpaymentResponseComponent;
  let fixture: ComponentFixture<PaytmpaymentResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmpaymentResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmpaymentResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
