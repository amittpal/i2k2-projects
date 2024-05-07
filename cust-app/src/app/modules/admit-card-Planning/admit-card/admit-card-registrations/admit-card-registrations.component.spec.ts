import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardRegistrationsComponent } from './admit-card-registrations.component';

describe('AdmitCardRegistrationsComponent', () => {
  let component: AdmitCardRegistrationsComponent;
  let fixture: ComponentFixture<AdmitCardRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
