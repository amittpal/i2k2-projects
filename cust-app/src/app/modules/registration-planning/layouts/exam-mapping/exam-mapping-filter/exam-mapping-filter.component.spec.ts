import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMappingFilterComponent } from './exam-mapping-filter.component';

describe('ExamMappingFilterComponent', () => {
  let component: ExamMappingFilterComponent;
  let fixture: ComponentFixture<ExamMappingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamMappingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamMappingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
