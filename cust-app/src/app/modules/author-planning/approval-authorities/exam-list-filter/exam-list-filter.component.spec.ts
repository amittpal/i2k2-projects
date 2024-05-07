import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamListFilterComponent } from './exam-list-filter.component';

describe('ExamListFilterComponent', () => {
  let component: ExamListFilterComponent;
  let fixture: ComponentFixture<ExamListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
