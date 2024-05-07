import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamHeaderComponent } from './exam-header.component';

describe('ExamHeaderComponent', () => {
  let component: ExamHeaderComponent;
  let fixture: ComponentFixture<ExamHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
