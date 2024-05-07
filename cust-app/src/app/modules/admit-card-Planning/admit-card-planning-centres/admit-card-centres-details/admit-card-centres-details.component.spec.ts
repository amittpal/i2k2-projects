import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardCentresDetailsComponent } from './admit-card-centres-details.component';

describe('AdmitCardCentresDetailsComponent', () => {
  let component: AdmitCardCentresDetailsComponent;
  let fixture: ComponentFixture<AdmitCardCentresDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardCentresDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardCentresDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
