import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExamShiftsComponent } from './manage-exam-shifts.component';

describe('ManageExamShiftsComponent', () => {
  let component: ManageExamShiftsComponent;
  let fixture: ComponentFixture<ManageExamShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageExamShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExamShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
