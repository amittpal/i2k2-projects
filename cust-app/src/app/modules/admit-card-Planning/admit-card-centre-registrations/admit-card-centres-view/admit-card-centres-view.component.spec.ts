import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardCentresViewComponent } from './admit-card-centres-view.component';

describe('AdmitCardCentresViewComponent', () => {
  let component: AdmitCardCentresViewComponent;
  let fixture: ComponentFixture<AdmitCardCentresViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardCentresViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardCentresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
