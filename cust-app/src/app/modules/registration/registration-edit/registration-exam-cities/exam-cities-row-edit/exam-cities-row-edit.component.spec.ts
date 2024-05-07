import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCitiesRowEditComponent } from './exam-cities-row-edit.component';

describe('ExamCitiesRowEditComponent', () => {
  let component: ExamCitiesRowEditComponent;
  let fixture: ComponentFixture<ExamCitiesRowEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamCitiesRowEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamCitiesRowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
