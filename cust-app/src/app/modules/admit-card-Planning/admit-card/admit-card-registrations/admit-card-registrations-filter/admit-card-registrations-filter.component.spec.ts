import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardRegistrationsFilterComponent } from './admit-card-registrations-filter.component';

describe('AdmitCardRegistrationsFilterComponent', () => {
  let component: AdmitCardRegistrationsFilterComponent;
  let fixture: ComponentFixture<AdmitCardRegistrationsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardRegistrationsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardRegistrationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
