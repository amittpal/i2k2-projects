import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayumoneyViewComponent } from './payumoney-view.component';

describe('PayumoneyViewComponent', () => {
  let component: PayumoneyViewComponent;
  let fixture: ComponentFixture<PayumoneyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayumoneyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayumoneyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
