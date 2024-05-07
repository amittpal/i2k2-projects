import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentManagementFilterComponent } from './payment-management-filter.component';

describe('PaymentManagementFilterComponent', () => {
  let component: PaymentManagementFilterComponent;
  let fixture: ComponentFixture<PaymentManagementFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentManagementFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
