import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardGenerateListFilterComponent } from './admit-card-generate-list-filter.component';

describe('AdmitCardGenerateListFilterComponent', () => {
  let component: AdmitCardGenerateListFilterComponent;
  let fixture: ComponentFixture<AdmitCardGenerateListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardGenerateListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardGenerateListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
