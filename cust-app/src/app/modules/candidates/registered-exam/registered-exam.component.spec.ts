import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredExamComponent } from './registered-exam.component';

describe('RegisteredExamComponent', () => {
  let component: RegisteredExamComponent;
  let fixture: ComponentFixture<RegisteredExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
