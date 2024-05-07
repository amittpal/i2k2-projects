import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardCentreRegistrationsFilterComponent } from './admit-card-centre-registrations-filter.component';

describe('AdmitCardCentreRegistrationsFilterComponent', () => {
  let component: AdmitCardCentreRegistrationsFilterComponent;
  let fixture: ComponentFixture<AdmitCardCentreRegistrationsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardCentreRegistrationsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardCentreRegistrationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
