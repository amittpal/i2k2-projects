import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardCentreRegistrationsComponent } from './admit-card-centre-registrations.component';

describe('AdmitCardCentreRegistrationsComponent', () => {
  let component: AdmitCardCentreRegistrationsComponent;
  let fixture: ComponentFixture<AdmitCardCentreRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardCentreRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardCentreRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
