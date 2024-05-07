import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListFilterComponent } from './payment-list-filter.component';

describe('PaymentListFilterComponent', () => {
  let component: PaymentListFilterComponent;
  let fixture: ComponentFixture<PaymentListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
