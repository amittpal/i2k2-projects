import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeSetupComponent } from './qrcode-setup.component';

describe('QrcodeSetupComponent', () => {
  let component: QrcodeSetupComponent;
  let fixture: ComponentFixture<QrcodeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
