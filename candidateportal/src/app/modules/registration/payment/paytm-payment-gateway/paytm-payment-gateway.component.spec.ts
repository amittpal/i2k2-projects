import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PaytmPaymentGatewayComponent } from './paytm-payment-gateway.component';


describe('PaytmPaymentGatewayComponent', () => {
  let component: PaytmPaymentGatewayComponent;
  let fixture: ComponentFixture<PaytmPaymentGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmPaymentGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmPaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
