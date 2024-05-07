import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialPaymentComponent } from './trial-payment.component';

describe('TrialPaymentComponent', () => {
  let component: TrialPaymentComponent;
  let fixture: ComponentFixture<TrialPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
