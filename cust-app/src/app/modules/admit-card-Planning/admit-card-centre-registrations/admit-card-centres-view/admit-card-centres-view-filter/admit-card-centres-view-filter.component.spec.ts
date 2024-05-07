import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardCentresViewFilterComponent } from './admit-card-centres-view-filter.component';

describe('AdmitCardCentresViewFilterComponent', () => {
  let component: AdmitCardCentresViewFilterComponent;
  let fixture: ComponentFixture<AdmitCardCentresViewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardCentresViewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardCentresViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
