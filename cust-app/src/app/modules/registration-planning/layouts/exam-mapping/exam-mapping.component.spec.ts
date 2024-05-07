import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMappingComponent } from './exam-mapping.component';

describe('ExamMappingComponent', () => {
  let component: ExamMappingComponent;
  let fixture: ComponentFixture<ExamMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
