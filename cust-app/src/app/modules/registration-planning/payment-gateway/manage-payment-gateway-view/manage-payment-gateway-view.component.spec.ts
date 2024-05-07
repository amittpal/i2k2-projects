import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentGatewayViewComponent } from './manage-payment-gateway-view.component';

describe('ManagePaymentGatewayViewComponent', () => {
  let component: ManagePaymentGatewayViewComponent;
  let fixture: ComponentFixture<ManagePaymentGatewayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePaymentGatewayViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentGatewayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
