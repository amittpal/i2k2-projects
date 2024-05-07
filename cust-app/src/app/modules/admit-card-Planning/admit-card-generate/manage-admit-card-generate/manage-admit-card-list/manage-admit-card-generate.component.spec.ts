import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardGenerateComponent } from './manage-admit-card-generate.component';

describe('ManageAdmitCardGenerateComponent', () => {
  let component: ManageAdmitCardGenerateComponent;
  let fixture: ComponentFixture<ManageAdmitCardGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
