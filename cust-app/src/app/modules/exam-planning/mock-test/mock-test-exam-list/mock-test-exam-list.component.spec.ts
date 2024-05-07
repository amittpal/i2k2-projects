import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockTestExamListComponent } from './mock-test-exam-list.component';

describe('MockTestExamListComponent', () => {
  let component: MockTestExamListComponent;
  let fixture: ComponentFixture<MockTestExamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockTestExamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockTestExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
