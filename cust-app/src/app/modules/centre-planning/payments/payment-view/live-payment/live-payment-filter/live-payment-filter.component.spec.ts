import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivePaymentFilterComponent } from './live-payment-filter.component';

describe('LivePaymentFilterComponent', () => {
  let component: LivePaymentFilterComponent;
  let fixture: ComponentFixture<LivePaymentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivePaymentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivePaymentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
