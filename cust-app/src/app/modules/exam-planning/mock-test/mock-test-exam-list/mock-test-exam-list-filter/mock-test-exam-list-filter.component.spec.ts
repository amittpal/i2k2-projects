import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockTestExamListFilterComponent } from './mock-test-exam-list-filter.component';

describe('MockTestExamListFilterComponent', () => {
  let component: MockTestExamListFilterComponent;
  let fixture: ComponentFixture<MockTestExamListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockTestExamListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockTestExamListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
