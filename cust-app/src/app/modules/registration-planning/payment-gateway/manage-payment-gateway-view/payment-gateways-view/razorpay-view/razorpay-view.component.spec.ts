import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpayViewComponent } from './razorpay-view.component';

describe('RazorpayComponent', () => {
  let component: RazorpayViewComponent;
  let fixture: ComponentFixture<RazorpayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazorpayViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorpayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
