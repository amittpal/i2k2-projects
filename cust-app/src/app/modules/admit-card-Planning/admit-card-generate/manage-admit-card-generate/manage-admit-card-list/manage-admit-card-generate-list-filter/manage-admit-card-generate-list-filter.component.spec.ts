import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardGenerateListFilterComponent } from './manage-admit-card-generate-list-filter.component';

describe('ManageAdmitCardGenerateListFilterComponent', () => {
  let component: ManageAdmitCardGenerateListFilterComponent;
  let fixture: ComponentFixture<ManageAdmitCardGenerateListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardGenerateListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardGenerateListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
