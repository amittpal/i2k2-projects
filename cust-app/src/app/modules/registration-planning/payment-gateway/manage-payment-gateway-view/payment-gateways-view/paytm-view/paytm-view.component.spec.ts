import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmViewComponent } from './paytm-view.component';

describe('PaytmViewComponent', () => {
  let component: PaytmViewComponent;
  let fixture: ComponentFixture<PaytmViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
